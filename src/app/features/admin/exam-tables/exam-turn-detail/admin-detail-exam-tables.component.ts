
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import {
    MesaExamenResponse,
    DetalleMesaExamenResponse,
    CarreraAdminDTO,
    SimpleMateriaDTO,
    ProfesorDisponibleDTO,
    DetalleMesaRequest
} from '@core/models/admin.models';

@Component({
    selector: 'app-admin-detail-exam-tables',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent, ConfirmationModalComponent],
    templateUrl: './admin-detail-exam-tables.component.html',
    styleUrls: ['./styles/admin-detail-exam-tables.component.css']
})
export class AdminDetailExamTablesComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    turnId: string | null = null;
    turn: MesaExamenResponse | null = null;
    isLoading = false;

    
    showDeleteConfirmation = false;
    itemToDelete: DetalleMesaExamenResponse | null = null;

    
    showAddModal = false;
    addStep: 'SUBJECT' | 'DATETIME' | 'PROFESSOR' = 'SUBJECT';
    carreras: CarreraAdminDTO[] = [];

    
    selectedCarreraId: string = '';
    subjectQuery: string = '';
    foundSubjects: SimpleMateriaDTO[] = [];
    selectedSubject: SimpleMateriaDTO | null = null;

    examDate: string = '';
    examTime: string = '';

    availablePresidents: ProfesorDisponibleDTO[] = [];
    selectedPresidentId: string = '';

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.turnId = params.get('id');
            if (this.turnId) {
                this.loadTurnDetails(this.turnId);
            } else {
                this.alertService.error('ID de turno no válido');
                this.goBack();
            }
        });
    }

    loadTurnDetails(id: string) {
        this.isLoading = true;
        this.adminService.getAllTurnos().subscribe({
            next: (data) => {
                const foundTurn = data.find(t => t.id === id);
                if (foundTurn) {
                    this.turn = foundTurn;
                    if (!this.turn.detalles) {
                        this.turn.detalles = [];
                    }
                } else {
                    this.alertService.error('Turno no encontrado');
                    this.goBack();
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar detalles del turno');
                this.isLoading = false;
                this.goBack();
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/exam-tables']);
    }

    

    deleteDetalle(mesa: DetalleMesaExamenResponse) {
        if ((mesa.cantidadInscriptos || 0) > 0) {
            this.alertService.error('No se puede eliminar una mesa con alumnos inscriptos.');
            return;
        }

        if (this.isDatePassed(mesa.diaExamen)) {
            this.alertService.error('No se puede eliminar una mesa cuya fecha ya ha pasado.');
            return;
        }

        this.itemToDelete = mesa;
        this.showDeleteConfirmation = true;
    }

    confirmDelete() {
        if (this.itemToDelete && this.turnId) {
            const nroDetalle = this.itemToDelete.nroDetalle;
            this.showDeleteConfirmation = false;
            this.isLoading = true;

            this.adminService.eliminarDetalleMesa(this.turnId, nroDetalle).subscribe({
                next: () => {
                    this.alertService.success('Mesa eliminada');
                    this.itemToDelete = null;
                    this.loadTurnDetails(this.turnId!);
                },
                error: (err) => {
                    console.error(err);
                    this.alertService.error('Error al eliminar mesa');
                    this.isLoading = false;
                }
            });
        }
    }

    cancelDelete() {
        this.showDeleteConfirmation = false;
        this.itemToDelete = null;
    }

    isDatePassed(dateString: string): boolean {
        
        const examDate = new Date(dateString);
        
        
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        
        
        
        const dateParts = dateString.split('-');
        const year = +dateParts[0];
        const month = +dateParts[1] - 1;
        const day = +dateParts[2];
        const localExamDate = new Date(year, month, day);

        return localExamDate < now;
    }

    

    openAddModal() {
        this.showAddModal = true;
        this.resetWizard();
        if (this.carreras.length === 0) {
            this.loadCarreras();
        }
    }

    closeAddModal() {
        this.showAddModal = false;
    }

    resetWizard() {
        this.addStep = 'SUBJECT';
        this.selectedCarreraId = '';
        this.subjectQuery = '';
        this.foundSubjects = [];
        this.selectedSubject = null;
        this.examDate = '';
        this.examTime = '';
        this.availablePresidents = [];
        this.selectedPresidentId = '';
    }

    loadCarreras() {
        this.adminService.getAllCarreras().subscribe(data => this.carreras = data);
    }

    searchSubjects() {
        if (!this.selectedCarreraId || !this.subjectQuery) return;
        this.isLoading = true;
        this.adminService.buscarMaterias(this.selectedCarreraId, this.subjectQuery).subscribe({
            next: (data) => {
                this.foundSubjects = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al buscar materias');
                this.isLoading = false;
            }
        });
    }

    selectSubject(subject: SimpleMateriaDTO) {
        this.selectedSubject = subject;
        this.addStep = 'DATETIME';
    }

    findPresidents() {
        if (!this.selectedSubject || !this.examDate || !this.examTime) {
            this.alertService.warning('Complete materia, fecha y hora.');
            return;
        }

        this.isLoading = true;
        this.adminService.getProfesoresParaMesa(this.selectedSubject.id, this.examDate, this.examTime).subscribe({
            next: (data) => {
                this.availablePresidents = data;
                this.addStep = 'PROFESSOR';
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al buscar presidentes');
                this.isLoading = false;
            }
        });
    }

    selectPresident(id: string) {
        this.selectedPresidentId = id;
    }

    saveExam() {
        if (!this.turnId || !this.selectedSubject || !this.selectedPresidentId) return;

        const request: DetalleMesaRequest = {
            idMesaExamen: this.turnId,
            idMateria: this.selectedSubject.id,
            idPresidente: this.selectedPresidentId,
            diaExamen: this.examDate,
            horaExamen: this.examTime
        };

        this.isLoading = true;
        this.adminService.agregarDetalleMesa(request).subscribe({
            next: () => {
                this.alertService.success('Mesa agregada correctamente');
                this.closeAddModal();
                this.loadTurnDetails(this.turnId!);
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al agregar mesa');
                this.isLoading = false;
            }
        });
    }
}
