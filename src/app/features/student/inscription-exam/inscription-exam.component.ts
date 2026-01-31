import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { MesaExamenService } from '@core/services/mesa-examen.service';
import { AuthService } from '@core/services/auth.service';
import { CarreraMateriasDTO } from '@core/models/carrera-materias.models';
import { InscripcionExamenRequest } from '@core/models/inscripcion-examen.models';
import { DetalleMesaExamenResponse } from '@core/models/detalle-mesa-examen.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { take } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { InscriptionModalComponent } from '@shared/components/inscription-modal/inscription-modal.component';

@Component({
    selector: 'app-inscription-exam',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        FormsModule,
        PageLayoutComponent,
        LoadingSpinnerComponent,
        AlertMessageComponent,
        InscriptionModalComponent
    ],
    templateUrl: './inscription-exam.component.html',
    styleUrl: './styles/inscription-exam.component.css'
})
export class InscriptionExamComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private inscripcionService = inject(InscripcionExamenService);
    private mesaExamenService = inject(MesaExamenService);
    private authService = inject(AuthService);
    private location = inject(Location);

    originalCarreras: CarreraMateriasDTO[] = [];
    carreras: CarreraMateriasDTO[] = [];

    // Changed to flat list of available exam details
    mesasDisponibles: DetalleMesaExamenResponse[] = [];

    isLoading: boolean = false;

    // Messages
    errorMessage: string = '';
    successMessage: string = '';

    // State for Modal
    selectedExamDetail: DetalleMesaExamenResponse | null = null;
    selectedMateriaForEnrollment: any = null;
    showModal: boolean = false;

    // Filters
    filterNombre: string = '';
    filterEstado: string = '';
    filterTipo: string = '';
    filterNivel: string = '';

    uniqueNombres: string[] = [];
    estados: string[] = ['PENDIENTE', 'CURSANDO', 'REGULAR', 'APROBADA', 'LIBRE'];
    tipos: string[] = ['Obligatoria', 'Electiva'];
    niveles: number[] = [];

    columns: TableColumn[] = [
        { key: 'nombre', label: 'Materia', sortable: true },
    ];

    simpleColumns: TableColumn[] = [
        { key: 'nivel', label: 'Nivel', sortable: true },
        { key: 'nombre', label: 'Materia', sortable: true },
        { key: 'tipo', label: 'Tipo', sortable: true },
        { key: 'estado', label: 'Estado', sortable: true },
        { key: 'nota', label: 'Nota', sortable: true }
    ];

    actions: TableAction[] = [
        {
            name: 'inscribirse',
            label: 'Inscribirse',
            class: 'btn-inscription',
            isVisible: (row: any) => row.sePuedeInscribir === true
        },
        {
            name: 'sin-fechas',
            label: 'Sin fechas',
            class: 'btn-disabled-action',
            isVisible: (row: any) => row.condicionAcademica === true && row.sePuedeInscribir === false
        }
    ];

    ngOnInit(): void {
        this.loadMaterias();
    }

    loadMaterias() {
        this.isLoading = true;
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                console.log('✅ [InscriptionExam] Data received:', data);

                data.forEach(carrera => {
                    carrera.materias.forEach((materia: any) => {
                        materia.tipo = materia.esElectiva ? 'Electiva' : 'Obligatoria';
                        materia.sePuedeInscribir = false;

                        // Exam Inscription Validation Logic
                        const esIngles = ['Inglés I', 'Inglés II'].includes(materia.nombre);
                        const esRegular = materia.estado === 'REGULAR';
                        const estaAprobada = materia.estado === 'APROBADA';
                        const condicionAcademica = !estaAprobada && (esRegular || esIngles);

                        materia.condicionAcademica = condicionAcademica;
                    });
                });

                this.originalCarreras = JSON.parse(JSON.stringify(data));
                this.carreras = data;
                this.extractUniqueNombres();
                this.extractUniqueNiveles();

                // Load available exam tables
                this.loadMesas();
            },
            error: (err) => {
                console.error('❌ [InscriptionExam] Error loading materias:', err);
                this.errorMessage = 'Error al cargar las materias.';
                this.isLoading = false;
            }
        });
    }

    loadMesas() {
        // Use the STUDENT endpoint: /mesas/disponibles
        this.mesaExamenService.listarMesasDisponibles().subscribe({
            next: (detalles) => {
                this.mesasDisponibles = detalles;
                console.log('✅ [InscriptionExam] Mesas Disponibles loaded:', detalles);

                if (this.carreras.length > 0) {
                    this.updateInscriptionStatus();
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ [InscriptionExam] Error loading mesas disponibles:', err);
                this.errorMessage = 'Error al cargar mesas de examen disponibles.';
                this.isLoading = false;
            }
        });
    }

    updateInscriptionStatus() {
        this.carreras.forEach(carrera => {
            carrera.materias.forEach((materia: any) => {
                if (materia.condicionAcademica) {
                    // Match by ID. Since DetalleMesaExamenResponse has idMateria, we can match directly.
                    const detalleFound = this.mesasDisponibles.find(d => d.idMateria === materia.idMateria);

                    if (detalleFound) {
                        materia.sePuedeInscribir = true;
                        materia.mesaDetalle = detalleFound; // Store the simplified detail
                    } else {
                        materia.sePuedeInscribir = false;
                    }
                }
            });
        });
    }

    extractUniqueNombres() {
        const nombres = new Set<string>();
        this.originalCarreras.forEach(carrera => {
            carrera.materias.forEach(materia => nombres.add(materia.nombre));
        });
        this.uniqueNombres = Array.from(nombres).sort();
    }

    extractUniqueNiveles() {
        const nivelesSet = new Set<number>();
        this.originalCarreras.forEach(carrera => {
            carrera.materias.forEach(materia => nivelesSet.add(materia.nivel));
        });
        this.niveles = Array.from(nivelesSet).sort((a, b) => a - b);
    }

    onMateriaChange() {
        if (this.filterNombre) {
            this.filterNivel = '';
            this.filterTipo = '';
            this.filterEstado = '';
        }
        this.applyFilters();
    }

    clearFilters() {
        this.filterNombre = '';
        this.filterNivel = '';
        this.filterTipo = '';
        this.filterEstado = '';
        this.applyFilters();
    }

    applyFilters() {
        const tempCarreras = JSON.parse(JSON.stringify(this.originalCarreras));

        this.carreras = tempCarreras.map((carrera: CarreraMateriasDTO) => {
            carrera.materias = carrera.materias.filter((materia: any) => {
                const matchesNombre = this.filterNombre ? materia.nombre === this.filterNombre : true;

                if (this.filterNombre) {
                    return matchesNombre;
                }

                const matchesEstado = this.filterEstado ? materia.estado === this.filterEstado : true;
                const matchesTipo = this.filterTipo ? materia.tipo === this.filterTipo : true;
                const matchesNivel = this.filterNivel ? materia.nivel.toString() === this.filterNivel : true;
                return matchesEstado && matchesTipo && matchesNivel;
            });
            return carrera;
        }).filter((carrera: CarreraMateriasDTO) => carrera.materias.length > 0);
    }

    handleAction(event: ActionEvent<any>) {
        if (event.action === 'inscribirse') {
            const materia = event.row;
            if (!materia.mesaDetalle) {
                this.errorMessage = 'No se encontró mesa para esta materia.';
                return;
            }

            const initialDetalle = materia.mesaDetalle as DetalleMesaExamenResponse;
            this.isLoading = true;

            // Call endpoint: /mesas/detalles/{id}/{nroDetalle}
            this.mesaExamenService.obtenerDetalleMesa(initialDetalle.idMesaExamen, initialDetalle.nroDetalle).subscribe({
                next: (fullDetalle) => {
                    this.isLoading = false;
                    this.openConfirmationModal(materia, fullDetalle);
                },
                error: (err) => {
                    console.error('Error verifying mesa detail', err);
                    this.isLoading = false;
                    this.errorMessage = 'No se pudo verificar el detalle de la mesa. Intente nuevamente.';
                }
            });
        }
    }

    openConfirmationModal(materia: any, detalle: DetalleMesaExamenResponse) {
        this.selectedMateriaForEnrollment = materia;
        this.selectedExamDetail = detalle;
        this.showModal = true;
    }

    onConfirmEnrollment() {
        if (!this.selectedMateriaForEnrollment || !this.selectedExamDetail) return;

        this.showModal = false;
        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (!user) {
                this.errorMessage = 'Error: Usuario no identificado';
                return;
            }

            const request: InscripcionExamenRequest = {
                idUsuario: user.id,
                idMesaExamen: this.selectedExamDetail!.idMesaExamen,
                nroDetalle: this.selectedExamDetail!.nroDetalle
            };

            this.isLoading = true;
            this.clearMessages();

            this.inscripcionService.inscribirExamen(request).subscribe({
                next: (res) => {
                    console.log('Inscripción a examen exitosa:', res);
                    this.successMessage = `Inscripción exitosa al examen de ${this.selectedMateriaForEnrollment.nombre}`;
                    this.isLoading = false;
                    this.loadMaterias();
                },
                error: (err) => {
                    console.error('Error al inscribirse al examen:', err);
                    this.errorMessage = 'Error al procesar la inscripción al examen';
                    this.isLoading = false;
                }
            });
        });
    }

    closeModal() {
        this.showModal = false;
        this.selectedExamDetail = null;
        this.selectedMateriaForEnrollment = null;
    }

    clearMessages() {
        this.errorMessage = '';
        this.successMessage = '';
    }

    goBack(): void {
        this.location.back();
    }
}
