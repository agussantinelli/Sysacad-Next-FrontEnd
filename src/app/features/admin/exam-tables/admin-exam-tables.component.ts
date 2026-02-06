import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { MesaExamenRequest, CarreraAdminDTO, SimpleMateriaDTO, ProfesorDisponibleDTO, DetalleMesaRequest, MesaExamenResponse, DetalleMesaExamenResponse } from '@core/models/admin.models';

import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-admin-exam-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent, ConfirmationModalComponent],
  templateUrl: './admin-exam-tables.component.html',
  styleUrl: './styles/admin-exam-tables.component.css'
})
export class AdminExamTablesComponent implements OnInit {
  private adminService = inject(AdminService);
  private alertService = inject(AlertService);

  // Data Source: List of Turns (Hierarchical)
  turns: MesaExamenResponse[] = [];
  selectedTurno: MesaExamenResponse | null = null;
  // uniqueTurnos: string[] = []; // No longer needed

  isLoading = false;

  // New features state
  carreras: CarreraAdminDTO[] = [];
  showAddModal = false;

  // Delete Confirmation State
  showDeleteConfirmation = false;
  deleteType: 'TURN' | 'DETAIL' = 'DETAIL';
  itemToDelete: DetalleMesaExamenResponse | null = null; // For Table Details
  turnToDelete: MesaExamenResponse | null = null; // For Turns

  // Add Exam Wizard State
  addStep: 'SUBJECT' | 'DATETIME' | 'PROFESSOR' = 'SUBJECT';
  newExam: Partial<DetalleMesaRequest> = {};

  // Wizard Helper Data
  selectedCarreraId: string = '';
  subjectQuery: string = '';
  foundSubjects: SimpleMateriaDTO[] = [];
  selectedSubject: SimpleMateriaDTO | null = null;

  examDate: string = '';
  examTime: string = '';

  availablePresidents: ProfesorDisponibleDTO[] = [];
  selectedPresidentId: string = '';

  // Turn Form State
  isEditingTurn = false;
  editingTurnId: string | null = null;
  newTurno: MesaExamenRequest = {
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  };

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.isLoading = true;
    this.adminService.getAllTurnos().subscribe({
      next: (data) => {
        this.turns = data;
        // If a turn was selected, refresh it
        if (this.selectedTurno) {
          this.selectedTurno = this.turns.find(t => t.id === this.selectedTurno!.id) || null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Error al cargar turnos');
        this.isLoading = false;
      }
    });
  }

  // processTurnos() removed

  selectTurno(turno: MesaExamenResponse) {
    this.selectedTurno = turno;
  }

  clearSelection() {
    this.selectedTurno = null;
  }

  // get filteredMesas removed - simply use selectedTurno.detalles

  getMesasCount(turno: MesaExamenResponse): number {
    return turno.detalles ? turno.detalles.length : 0;
  }

  // --- Turn Management ---

  showCreateTurnModal = false;

  openCreateTurnModal() {
    this.isEditingTurn = false;
    this.editingTurnId = null;
    this.newTurno = { nombre: '', fechaInicio: '', fechaFin: '' };
    this.showCreateTurnModal = true;
  }

  closeCreateTurnModal() {
    this.showCreateTurnModal = false;
  }

  editTurno(turno: MesaExamenResponse, event: Event) {
    event.stopPropagation(); // Prevent card selection
    this.isEditingTurn = true;
    this.editingTurnId = turno.id;
    this.newTurno = {
      nombre: turno.nombre,
      fechaInicio: turno.fechaInicio,
      fechaFin: turno.fechaFin
    };
    this.showCreateTurnModal = true;
  }

  saveTurno() {
    this.isLoading = true;

    if (this.isEditingTurn && this.editingTurnId) {
      this.adminService.editarTurno(this.editingTurnId, this.newTurno).subscribe({
        next: () => {
          this.alertService.success('Turno actualizado correctamente');
          this.closeCreateTurnModal();
          this.loadTurnos();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Error al actualizar turno');
          this.isLoading = false;
        }
      });
    } else {
      this.adminService.crearTurno(this.newTurno).subscribe({
        next: () => {
          this.alertService.success('Turno creado correctamente');
          this.closeCreateTurnModal();
          this.loadTurnos();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Error al crear turno');
          this.isLoading = false;
        }
      });
    }
  }

  deleteTurno(turno: MesaExamenResponse, event: Event) {
    event.stopPropagation();
    if (turno.cantidadInscriptos > 0 || (turno.detalles && turno.detalles.some(d => d.cantidadInscriptos > 0))) {
      this.alertService.error('No se puede eliminar un turno con inscripciones activas inside.');
      // Note: Backend handles deep validation, but frontend check is good UX.
      // Assuming 'cantidadInscriptos' on turn aggregates everything? 
      // User request says: "Valida que no tenga alumnos inscriptos."
      // We'll trust backend mostly, but if we have the data, block it.
      if (turno.cantidadInscriptos > 0) return;
    }

    this.deleteType = 'TURN';
    this.turnToDelete = turno;
    this.showDeleteConfirmation = true;
  }

  deleteDetalle(mesa: DetalleMesaExamenResponse) {
    if (mesa.cantidadInscriptos > 0) {
      this.alertService.error('No se puede eliminar una mesa con alumnos inscriptos.');
      return;
    }

    if (this.isDatePassed(mesa.fecha)) {
      this.alertService.error('No se puede eliminar una mesa cuya fecha ya ha pasado.');
      return;
    }

    this.deleteType = 'DETAIL';
    this.itemToDelete = mesa;
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    if (this.deleteType === 'DETAIL' && this.itemToDelete) {
      const idMesaStr = this.itemToDelete.idMesaExamen;
      const nroDetalle = this.itemToDelete.nroDetalle;

      this.cancelDelete();
      this.isLoading = true;

      this.adminService.eliminarDetalleMesa(idMesaStr, nroDetalle).subscribe({
        next: () => {
          this.alertService.success('Mesa eliminada');
          this.loadTurnos();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Error al eliminar mesa');
          this.isLoading = false;
        }
      });
    } else if (this.deleteType === 'TURN' && this.turnToDelete) {
      const idTurno = this.turnToDelete.id;

      this.cancelDelete();
      this.isLoading = true;

      this.adminService.eliminarTurno(idTurno).subscribe({
        next: () => {
          this.alertService.success('Turno eliminado');
          this.loadTurnos();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Error al eliminar turno'); // Check if 400 bad request for inscriptions
          this.isLoading = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.itemToDelete = null;
    this.turnToDelete = null;
  }

  isDatePassed(dateString: string): boolean {
    const examDate = new Date(dateString);
    const now = new Date();
    return examDate < now;
  }


  // --- Add Exam Feature ---



  // --- Add Exam Feature ---

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
    this.newExam = {};
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
    // New Logic: Use selectedTurno.id directly
    if (!this.selectedTurno) {
      this.alertService.error('No se pudo identificar el turno.');
      return;
    }

    const turnId = this.selectedTurno.id;

    if (!turnId) {
      this.alertService.error('ID del Turno inválido.');
      return;
    }

    if (!this.selectedSubject || !this.selectedPresidentId) return;

    const request: DetalleMesaRequest = {
      idMesaExamen: turnId,
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
        this.loadTurnos(); // Reload all turns to refresh data
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Error al agregar mesa');
        this.isLoading = false;
      }
    });
  }
}
