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
        turno: '',
        anio: new Date().getFullYear(),
        nivel: 1,
        idCarrera: '',
        idSalon: '',
        idsMaterias: [],
        idsProfesores: []
    };

    ngOnInit() {
        this.loadComisiones();
        this.loadCarreras();
    }

    loadComisiones() {
        this.isLoading = true;
        this.adminService.getAllComisiones().subscribe({
            next: (data) => {
                this.comisiones = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
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

        console.log('[AdminCommissions] Buscando salones disponibles para:', { turno: this.newComision.turno, anio: this.newComision.anio });

        this.adminService.getSalonesDisponibles(this.newComision.turno, this.newComision.anio).subscribe({
            next: (data) => {
                console.log('[AdminCommissions] Salones encontrados:', data);
                this.salones = data;
            },
            error: (err) => {
                console.error(err);
                // Don't block UI, just log
            }
        });
    }

    onTurnoOrAnioChange() {
        this.newComision.idSalon = ''; // Reset selection
        this.loadSalones();
    }

    // Modal Actions
    openCreateModal() {
        this.showModal = true;
        this.newComision = {
            nombre: '',
            turno: '',
            anio: new Date().getFullYear(),
            nivel: 1,
            idCarrera: this.carreras.length > 0 ? this.carreras[0].id : '',
            idSalon: '',
            idsMaterias: [],
            idsProfesores: []
        };
        this.salones = []; // Reset salones list
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
    selectedSubject: any = null;

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
        console.log('[loadAvailableSubjects] selectedComision:', this.selectedComision);

        if (!this.selectedComision) {
            this.alertService.error('Error: No hay comisión seleccionada.');
            return;
        }

        if (!this.selectedComision.idCarrera) {
            console.error('[loadAvailableSubjects] Missing idCarrera in commission:', this.selectedComision);
            this.alertService.error('Error: La comisión no tiene carrera asignada. Por favor, contacte al administrador.');
            return;
        }

        this.isLoading = true;
        // Fetch plan for the commission's year
        this.adminService.getPlanDetalle(this.selectedComision.idCarrera, this.selectedComision.anio).subscribe({
            next: (plan) => {
                // Filter out subjects already assigned to this commission
                const assignedIds = this.selectedComision!.materiasDetalle.map((m: any) => m.idMateria);
                // Also filter by nivel to only show subjects matching the commission's level
                this.availableSubjects = plan.materias.filter(m =>
                    !assignedIds.includes(m.id) && m.nivel === this.selectedComision!.nivel
                );
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar materias del plan');
                this.isLoading = false;
            }
        });
    }

    selectSubject(materia: any) {
        this.selectedSubjectId = materia.id;
        this.selectedSubject = materia;
        this.assignStep = 'SCHEDULE';
    }

    addSchedule() {
        if (this.newSchedule.horaDesde && this.newSchedule.horaHasta) {
            // Validate time range
            if (this.newSchedule.horaDesde >= this.newSchedule.horaHasta) {
                this.alertService.warning('La hora de inicio debe ser anterior a la hora de fin');
                return;
            }
            this.scheduleList.push({ ...this.newSchedule });
            this.newSchedule = { dia: 'LUNES', horaDesde: '', horaHasta: '' };
        }
    }

    calculateTotalHours(): number {
        return this.scheduleList.reduce((total, schedule) => {
            const [startH, startM] = schedule.horaDesde.split(':').map(Number);
            const [endH, endM] = schedule.horaHasta.split(':').map(Number);
            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;
            const diffMinutes = endMinutes - startMinutes;
            return total + (diffMinutes / 60);
        }, 0);
    }

    validateSchedules(): boolean {
        if (!this.selectedSubject || this.scheduleList.length === 0) return false;
        const totalHours = this.calculateTotalHours();
        return totalHours === this.selectedSubject.horasCursado;
    }

    goToStep3() {
        if (!this.validateSchedules()) {
            const required = this.selectedSubject?.horasCursado || 0;
            const current = this.calculateTotalHours();
            this.alertService.warning(`Debe asignar exactamente ${required} horas (actualmente: ${current})`);
            return;
        }
        this.searchProfessors();
    }

    backToStep(step: 'SUBJECT' | 'SCHEDULE') {
        this.assignStep = step;
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
