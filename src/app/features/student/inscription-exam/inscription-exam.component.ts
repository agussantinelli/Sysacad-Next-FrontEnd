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
import { MesaExamenDisponibleDTO } from '@core/models/mesa-examen-disponible.models';
import { DetalleMesaExamenResponse } from '@core/models/detalle-mesa-examen.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { take } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { InscriptionModalComponent } from '@shared/components/inscription-modal/inscription-modal.component';
import { InscriptionConfirmationModalComponent } from '@shared/components/inscription-confirmation-modal/inscription-confirmation-modal.component';
import { AlertService } from '@core/services/alert.service';

@Component({
    selector: 'app-inscription-exam',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        FormsModule,
        PageLayoutComponent,
        LoadingSpinnerComponent,
        InscriptionModalComponent,
        InscriptionConfirmationModalComponent
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
    private alertService = inject(AlertService);

    originalCarreras: CarreraMateriasDTO[] = [];
    carreras: CarreraMateriasDTO[] = [];

    // Remove mesasDisponibles (bulk list)
    // mesasDisponibles: DetalleMesaExamenResponse[] = [];

    isLoading: boolean = false;

    // State for Modal
    availableExamTables: MesaExamenDisponibleDTO[] = [];
    selectedExamTable: MesaExamenDisponibleDTO | null = null;

    selectedMateriaForEnrollment: any = null;

    // Filters

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

                        const esIngles = ['Inglés I', 'Inglés II'].includes(materia.nombre);
                        const esRegular = materia.estado === 'REGULAR';
                        const estaAprobada = materia.estado === 'APROBADA';
                        const condicionAcademica = !estaAprobada && (esRegular || esIngles);

                        materia.condicionAcademica = condicionAcademica;
                        materia.sePuedeInscribir = condicionAcademica;
                    });
                });

                this.originalCarreras = JSON.parse(JSON.stringify(data));
                this.carreras = data;
                this.extractUniqueNombres();
                this.extractUniqueNiveles();

                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ [InscriptionExam] Error loading materias:', err);
                this.alertService.error('Error al cargar las materias.');
                this.isLoading = false;
            }
        });
    }

    // Removed loadMesas() and updateInscriptionStatus() as we fetch on demand now.

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
            this.selectedMateriaForEnrollment = materia;
            this.isLoading = true;
            this.alertService.clear();

            this.mesaExamenService.listarMesasPorMateria(materia.idMateria).subscribe({
                next: (mesas) => {
                    console.log('📚 Mesas disponibles:', mesas);
                    this.isLoading = false;

                    if (mesas.length === 0) {
                        this.alertService.error('No hay mesas de examen disponibles para esta materia.');
                        return;
                    }

                    this.availableExamTables = mesas;
                    this.showTableSelectionModal = true;
                },
                error: (err) => {
                    console.error('Error fetching exam tables', err);
                    this.isLoading = false;
                    this.alertService.error('No se pudieron cargar las mesas de examen.');
                }
            });
        }
    }

    // State for Modals
    showTableSelectionModal: boolean = false;
    showConfirmationModal: boolean = false;

    // Step 1: Selection
    onSelectTable(table: MesaExamenDisponibleDTO) {
        // User clicked "Inscribirse" on a table in the list
        this.selectedExamTable = table;
        this.showTableSelectionModal = false;
        this.showConfirmationModal = true;
    }

    // Step 2: Confirmation
    onConfirmEnrollment() {
        if (!this.selectedMateriaForEnrollment || !this.selectedExamTable) return;

        this.showConfirmationModal = false;
        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (!user) {
                this.alertService.error('Error: Usuario no identificado');
                return;
            }

            const request: InscripcionExamenRequest = {
                idUsuario: user.id,
                idDetalleMesa: this.selectedExamTable!.idDetalleMesa,
                nroDetalle: this.selectedExamTable!.nroDetalle
            };

            this.isLoading = true;
            this.alertService.clear();

            this.inscripcionService.inscribirExamen(request).subscribe({
                next: (res) => {
                    console.log('Inscripción a examen exitosa:', res);
                    this.alertService.success(`Inscripción exitosa al examen de ${this.selectedMateriaForEnrollment.nombre}`);
                    this.isLoading = false;
                    this.selectedExamTable = null;
                    this.loadMaterias();
                },
                error: (err) => {
                    console.error('Error al inscribirse al examen:', err);
                    const errorMessage = err.error?.message || 'Error al procesar la inscripción al examen';
                    this.alertService.error(errorMessage);
                    this.isLoading = false;
                }
            });
        });
    }

    closeTableSelectionModal() {
        this.showTableSelectionModal = false;
        this.selectedMateriaForEnrollment = null;
        this.selectedExamTable = null;
    }

    closeConfirmationModal() {
        this.showConfirmationModal = false;
        // Don't clear selectedMateria here if we want to go back?
        // Usually cancel means cancel everything.
        this.selectedExamTable = null;
    }

    goBack(): void {
        this.location.back();
    }
}
