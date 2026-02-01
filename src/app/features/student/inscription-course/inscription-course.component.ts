import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { ComisionService } from '@core/services/comision.service';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { CarreraMateriasDTO } from '@core/models/carrera-materias.models';
import { ComisionResponse } from '@core/models/comision.models';
import { ComisionDisponibleDTO } from '@core/models/comision-disponible.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { InscriptionModalComponent } from '@shared/components/inscription-modal/inscription-modal.component';
import { InscriptionConfirmationModalComponent } from '@shared/components/inscription-confirmation-modal/inscription-confirmation-modal.component';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service'; // Import service
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-inscription-course',
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
    templateUrl: './inscription-course.component.html',
    styleUrl: './styles/inscription-course.component.css'
})
export class InscriptionCourseComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private comisionService = inject(ComisionService);
    private inscripcionCursadoService = inject(InscripcionCursadoService);
    private authService = inject(AuthService);
    private location = inject(Location);
    private alertService = inject(AlertService); // Inject service

    originalCarreras: CarreraMateriasDTO[] = [];
    carreras: CarreraMateriasDTO[] = [];
    isLoading: boolean = false;
    isCommissionsLoading: boolean = false;

    // Messages
    // Messages removed, using AlertService


    // Modal State
    showCommissionModal: boolean = false;
    showConfirmationModal: boolean = false;
    availableCommissions: ComisionDisponibleDTO[] = [];
    selectedMateriaForEnrollment: any = null;
    selectedCommissionForConfirmation: ComisionDisponibleDTO | null = null;

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
        }
    ];

    ngOnInit(): void {
        this.loadMaterias();
    }

    loadMaterias() {
        this.isLoading = true;
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                console.log('✅ [InscriptionCourse] Data received:', data);
                data.forEach(carrera => {
                    carrera.materias.forEach((materia: any) => {
                        materia.tipo = materia.esElectiva ? 'Electiva' : 'Obligatoria';

                        if (materia.esElectiva && materia.nivel > 1) {
                            const nivelAnterior = materia.nivel - 1;
                            const tieneRegularAnterior = carrera.materias.some((m: any) =>
                                m.nivel === nivelAnterior && (m.estado === 'REGULAR' || m.estado === 'APROBADA')
                            );

                            if (!tieneRegularAnterior) {
                                materia.sePuedeInscribir = false;
                                console.log(`🔒 Bloqueada electiva ${materia.nombre} (Nivel ${materia.nivel}) por falta de regular en Nivel ${nivelAnterior}`);
                            }
                        }
                    });
                });

                this.originalCarreras = JSON.parse(JSON.stringify(data));
                this.carreras = data;
                this.extractUniqueNombres();
                this.extractUniqueNiveles();
                console.log('✅ [InscriptionCourse] this.carreras set to:', this.carreras);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ [InscriptionCourse] Error loading materias:', err);
                this.isLoading = false;
            }
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
            this.openCommissionModal(event.row);
        }
    }

    openCommissionModal(materia: any) {
        this.selectedMateriaForEnrollment = materia;
        this.isCommissionsLoading = true;
        this.alertService.clear();

        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (!user) {
                this.alertService.error('Usuario no identificado.');
                this.isCommissionsLoading = false;
                return;
            }

            this.inscripcionCursadoService.getComisionesDisponibles(materia.idMateria, user.id).subscribe({
                next: (commissions) => {
                    console.log('📚 Comisiones disponibles para cursado:', commissions);
                    this.availableCommissions = commissions;

                    this.isCommissionsLoading = false;
                    this.showCommissionModal = true;

                    if (this.availableCommissions.length === 0) {
                        this.alertService.error('No hay comisiones disponibles para esta materia.');
                        this.showCommissionModal = false;
                    }
                },
                error: (err) => {
                    console.error('Error loading commissions', err);
                    this.isCommissionsLoading = false;
                    this.alertService.error('No se pudieron cargar las comisiones. Intente nuevamente.');
                }
            });
        });
    }

    // Step 1: User clicks "Confirmar" in the list modal (Inscribirse)
    onEnroll(commission: ComisionDisponibleDTO) {
        if (!this.selectedMateriaForEnrollment) return;

        // Save selection and switch modals
        this.selectedCommissionForConfirmation = commission;
        this.showCommissionModal = false; // Close list
        this.showConfirmationModal = true; // Open confirmation
    }

    // Confirm enrollment calls backend
    confirmEnrollment() {
        if (!this.selectedMateriaForEnrollment || !this.selectedCommissionForConfirmation) return;

        this.isLoading = true;
        this.showConfirmationModal = false; // Close confirm modal
        this.alertService.clear();

        this.inscripcionCursadoService.inscribirCursado({
            idMateria: this.selectedMateriaForEnrollment.idMateria,
            idComision: this.selectedCommissionForConfirmation.idComision
        }).subscribe({
            next: (response) => {
                console.log('✅ Inscripción exitosa:', response);
                this.alertService.success('Inscripción realizada con éxito!');
                this.isLoading = false;
                this.loadMaterias();
                this.selectedCommissionForConfirmation = null;
            },
            error: (err) => {
                console.error('Error enrolling', err);
                const errorMessage = err.error?.message || 'Hubo un error al realizar la inscripción.';
                this.alertService.error(errorMessage);
                this.isLoading = false;
            }
        });
    }

    closeModal() {
        this.showCommissionModal = false;
        this.selectedMateriaForEnrollment = null;
    }

    closeConfirmationModal() {
        this.showConfirmationModal = false;
        this.selectedCommissionForConfirmation = null;
    }



    goBack(): void {
        this.location.back();
    }
}
