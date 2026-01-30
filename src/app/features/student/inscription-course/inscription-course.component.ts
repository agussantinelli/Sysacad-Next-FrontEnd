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
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CommissionModalComponent } from './components/commission-modal/commission-modal.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component'; // Optional for alerts

@Component({
    selector: 'app-inscription-course',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        FormsModule,
        PageLayoutComponent,
        LoadingSpinnerComponent,
        CommissionModalComponent
    ],
    templateUrl: './inscription-course.component.html',
    styleUrl: './styles/inscription-course.component.css'
})
export class InscriptionCourseComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private comisionService = inject(ComisionService);
    private inscripcionCursadoService = inject(InscripcionCursadoService);
    private location = inject(Location);

    originalCarreras: CarreraMateriasDTO[] = [];
    carreras: CarreraMateriasDTO[] = [];
    isLoading: boolean = false;
    isCommissionsLoading: boolean = false;

    // Modal State
    showCommissionModal: boolean = false;
    availableCommissions: ComisionResponse[] = [];
    selectedMateriaForEnrollment: any = null;

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
                // Map esElectiva to display string
                data.forEach(carrera => {
                    carrera.materias.forEach((materia: any) => {
                        materia.tipo = materia.esElectiva ? 'Electiva' : 'Obligatoria';

                        // Custom Frontend Validation for Electives
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

                this.originalCarreras = JSON.parse(JSON.stringify(data)); // Deep copy to preserve original structure
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
        // Start from original data
        const tempCarreras = JSON.parse(JSON.stringify(this.originalCarreras));

        this.carreras = tempCarreras.map((carrera: CarreraMateriasDTO) => {
            // Filter materias within each carrera
            carrera.materias = carrera.materias.filter((materia: any) => {
                const matchesNombre = this.filterNombre ? materia.nombre === this.filterNombre : true;

                // If filtering by name, ignore other filters (as they are disabled/cleared)
                if (this.filterNombre) {
                    return matchesNombre;
                }

                const matchesEstado = this.filterEstado ? materia.estado === this.filterEstado : true;
                const matchesTipo = this.filterTipo ? materia.tipo === this.filterTipo : true;
                const matchesNivel = this.filterNivel ? materia.nivel.toString() === this.filterNivel : true;
                return matchesEstado && matchesTipo && matchesNivel;
            });
            return carrera;
        }).filter((carrera: CarreraMateriasDTO) => carrera.materias.length > 0); // Only show carreras with matching materias
    }

    handleAction(event: ActionEvent<any>) {
        if (event.action === 'inscribirse') {
            this.openCommissionModal(event.row);
        }
    }

    openCommissionModal(materia: any) {
        this.selectedMateriaForEnrollment = materia;
        this.isCommissionsLoading = true;

        // Use current year
        const currentYear = new Date().getFullYear();

        this.comisionService.listarPorAnio(currentYear).subscribe({
            next: (commissions) => {
                // Client-side filtering by name
                // Note: This relies on exact name match. May need normalization.
                this.availableCommissions = commissions.filter(c =>
                    c.materiasNombres.some(nombre => nombre.trim().toLowerCase() === materia.nombre.trim().toLowerCase())
                );
                this.isCommissionsLoading = false;
                this.showCommissionModal = true;

                if (this.availableCommissions.length === 0) {
                    alert('No hay comisiones disponibles para esta materia en este año.');
                    this.showCommissionModal = false;
                }
            },
            error: (err) => {
                console.error('Error loading commissions', err);
                this.isCommissionsLoading = false;
                alert('No se pudieron cargar las comisiones. Intente nuevamente.');
            }
        });
    }

    onEnroll(commission: ComisionResponse) {
        if (!this.selectedMateriaForEnrollment) return;

        this.isLoading = true;
        this.showCommissionModal = false;

        this.inscripcionCursadoService.inscribirCursado({
            idMateria: this.selectedMateriaForEnrollment.idMateria,
            idComision: commission.id
        }).subscribe({
            next: () => {
                alert('✅ Inscripción realizada con éxito!');
                this.isLoading = false;
                this.loadMaterias(); // Reload to update status
            },
            error: (err) => {
                console.error('Error enrolling', err);
                alert('Hubo un error al realizar la inscripción.');
                this.isLoading = false;
            }
        });
    }

    closeModal() {
        this.showCommissionModal = false;
        this.selectedMateriaForEnrollment = null;
    }

    goBack(): void {
        this.location.back();
    }
}
