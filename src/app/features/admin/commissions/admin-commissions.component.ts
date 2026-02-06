import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { AdminComisionDTO, ComisionRequest, CarreraAdminDTO } from '@core/models/admin.models';
import { SalonResponse } from '@core/models/salon.models';

@Component({
    selector: 'app-admin-commissions',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './admin-commissions.component.html',
    styleUrl: './styles/admin-commissions.component.css'
})
export class AdminCommissionsComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    comisiones: AdminComisionDTO[] = [];
    carreras: CarreraAdminDTO[] = [];
    salones: SalonResponse[] = [];
    isLoading = false;

    // View State
    viewMode: 'LIST' | 'DETAILS' = 'LIST';
    selectedComision: AdminComisionDTO | null = null;

    // Modal State
    showModal = false;
    newComision: ComisionRequest = {
        nombre: '',
        turno: 'Noche',
        anio: new Date().getFullYear(),
        salon: '',
        idCarrera: ''
    };

    ngOnInit() {
        this.loadComisiones();
        this.loadCarreras();
    }

    loadComisiones() {
        this.isLoading = true;
        this.adminService.getAllComisiones().subscribe({
            next: (data) => {
                this.comisiones = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar comisiones');
                this.isLoading = false;
            }
        });
    }

    loadCarreras() {
        this.adminService.getAllCarreras().subscribe(data => this.carreras = data);
    }

    loadSalones() {
        // Only load if we have year and shift
        if (!this.newComision.anio || !this.newComision.turno) return;

        this.adminService.getSalonesDisponibles(this.newComision.turno, this.newComision.anio).subscribe({
            next: (data) => {
                this.salones = data;
            },
            error: (err) => {
                console.error(err);
                // Don't block UI, just log
            }
        });
    }

    onTurnoOrAnioChange() {
        this.newComision.salon = ''; // Reset selection
        this.loadSalones();
    }

    // Modal Actions
    openCreateModal() {
        this.showModal = true;
        this.newComision = {
            nombre: '',
            turno: 'Noche',
            anio: new Date().getFullYear(),
            salon: '',
            idCarrera: this.carreras.length > 0 ? this.carreras[0].id : ''
        };
        this.loadSalones(); // Load initial availability
    }

    closeCreateModal() {
        this.showModal = false;
    }

    createComision() {
        if (!this.newComision.nombre || !this.newComision.idCarrera) return;

        this.isLoading = true;
        this.adminService.crearComision(this.newComision).subscribe({
            next: () => {
                this.alertService.success('Comisión creada exitosamente');
                this.loadComisiones();
                this.closeCreateModal();
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al crear comisión');
                this.isLoading = false;
            }
        });
    }

    // Details logic
    selectComision(comision: AdminComisionDTO) {
        this.selectedComision = comision;
        this.viewMode = 'DETAILS';
    }

    backToList() {
        this.selectedComision = null;
        this.viewMode = 'LIST';
    }

    // --- Assignment Logic ---
    showAssignModal = false;
    assignStep: 'SUBJECT' | 'SCHEDULE' | 'PROFESSORS' = 'SUBJECT';

    // Step 1: Subject
    availableSubjects: any[] = [];
    selectedSubjectId: string = '';

    // Step 2: Schedule
    scheduleList: { dia: string; horaDesde: string; horaHasta: string }[] = [];
    newSchedule = { dia: 'LUNES', horaDesde: '', horaHasta: '' };

    // Step 3: Professors
    availableProfessors: any[] = [];
    selectedProfessorIds: string[] = [];

    openAssignModal() {
        if (!this.selectedComision) return;
        this.showAssignModal = true;
        this.assignStep = 'SUBJECT';
        this.selectedSubjectId = '';
        this.scheduleList = [];
        this.selectedProfessorIds = [];
        this.availableProfessors = [];
        this.loadAvailableSubjects();
    }

    closeAssignModal() {
        this.showAssignModal = false;
    }

    loadAvailableSubjects() {
        if (!this.selectedComision || !this.selectedComision.idCarrera) {
            // Fallback if idCarrera is missing: try to find it from careers list? 
            // Ideally backend sends it. If not, we can't filter easily.
            this.alertService.error('Error: Faltan datos de la carrera en la comisión.');
            return;
        }

        this.isLoading = true;
        // Fetch plan for the commission's year
        this.adminService.getPlanDetalle(this.selectedComision.idCarrera, this.selectedComision.anio).subscribe({
            next: (plan) => {
                // Filter out subjects already assigned to this commission
                const assignedIds = this.selectedComision!.materias.map(m => m.idMateria);
                this.availableSubjects = plan.materias.filter(m => !assignedIds.includes(m.id));
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar materias del plan');
                this.isLoading = false;
            }
        });
    }

    addSchedule() {
        if (this.newSchedule.horaDesde && this.newSchedule.horaHasta) {
            this.scheduleList.push({ ...this.newSchedule });
            this.newSchedule = { dia: 'LUNES', horaDesde: '', horaHasta: '' };
        }
    }

    removeSchedule(index: number) {
        this.scheduleList.splice(index, 1);
    }

    searchProfessors() {
        if (!this.selectedSubjectId || this.scheduleList.length === 0) {
            this.alertService.warning('Seleccione materia y horarios.');
            return;
        }

        this.isLoading = true;
        const request = {
            idMateria: this.selectedSubjectId,
            idsProfesores: [], // Not used for search? The endpoint doc says body: AsignarMateriaComisionRequest uses idMateria, horarios
            horarios: this.scheduleList
        };

        this.adminService.getProfesoresDisponibles(request).subscribe({
            next: (professors) => {
                this.availableProfessors = professors;
                this.assignStep = 'PROFESSORS';
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al buscar profesores');
                this.isLoading = false;
            }
        });
    }

    toggleProfessor(id: string) {
        const index = this.selectedProfessorIds.indexOf(id);
        if (index >= 0) {
            this.selectedProfessorIds.splice(index, 1);
        } else {
            this.selectedProfessorIds.push(id);
        }
    }

    finalizeAssignment() {
        if (!this.selectedComision || this.selectedProfessorIds.length === 0) {
            this.alertService.warning('Seleccione al menos un profesor.');
            return;
        }

        this.isLoading = true;
        const request = {
            idMateria: this.selectedSubjectId,
            idsProfesores: this.selectedProfessorIds,
            horarios: this.scheduleList
        };

        this.adminService.asignarMateriaComision(this.selectedComision.id, request).subscribe({
            next: () => {
                this.alertService.success('Materia asignada correctamente');
                this.closeAssignModal();
                // Reload commissions to update the list
                this.loadComisiones();
                // Also update selectedComision if needed
                this.backToList(); // Simple way to refresh
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al asignar materia');
                this.isLoading = false;
            }
        });
    }
}
