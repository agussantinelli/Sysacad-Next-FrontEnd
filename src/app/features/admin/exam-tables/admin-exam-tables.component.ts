import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { MesaAdminDTO, MesaExamenRequest, CarreraAdminDTO, SimpleMateriaDTO, ProfesorDisponibleDTO, DetalleMesaRequest } from '@core/models/admin.models';

@Component({
  selector: 'app-admin-exam-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent],
  templateUrl: './admin-exam-tables.component.html',
  styleUrl: './styles/admin-exam-tables.component.css'
})
export class AdminExamTablesComponent implements OnInit {
  private adminService = inject(AdminService);
  private alertService = inject(AlertService);

  mesas: MesaAdminDTO[] = [];
  uniqueTurnos: string[] = [];
  selectedTurno: string | null = null;

  isLoading = false;

  // New features state
  carreras: CarreraAdminDTO[] = [];
  showAddModal = false;

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

  newTurno: MesaExamenRequest = {
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  };

  ngOnInit() {
    this.loadMesas();
  }

  loadMesas() {
    this.isLoading = true;
    this.adminService.getAllMesasAdmin().subscribe({
      next: (data) => {
        this.mesas = data;
        this.processTurnos();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Error al cargar mesas');
        this.isLoading = false;
      }
    });
  }

  processTurnos() {
    // Extract unique turn names
    this.uniqueTurnos = [...new Set(this.mesas.map(m => m.turno))].sort();
  }

  selectTurno(turno: string) {
    this.selectedTurno = turno;
  }

  clearSelection() {
    this.selectedTurno = null;
  }

  get filteredMesas() {
    if (!this.selectedTurno) return [];
    return this.mesas.filter(m => m.turno === this.selectedTurno);
  }

  getMesasCount(turno: string): number {
    return this.mesas.filter(m => m.turno === turno).length;
  }

  createTurno() {
    this.isLoading = true;
    this.adminService.crearTurno(this.newTurno).subscribe({
      next: () => {
        this.alertService.success('Turno creado correctamente');
        this.closeCreateTurnModal();
        this.loadMesas();
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Error al crear turno');
        this.isLoading = false;
      }
    });
  }

  deleteDetalle(mesa: MesaAdminDTO) {
    if (mesa.cantidadInscriptos > 0) {
      this.alertService.error('No se puede eliminar una mesa con alumnos inscriptos.');
      return;
    }

    if (this.isDatePassed(mesa.fecha)) {
      this.alertService.error('No se puede eliminar una mesa cuya fecha ya ha pasado.');
      return;
    }

    if (confirm(`¿Eliminar mesa de ${mesa.materia}?`)) {
      this.isLoading = true;
      this.adminService.eliminarDetalleMesa(mesa.idMesaExamen, mesa.nroDetalle).subscribe({
        next: () => {
          this.alertService.success('Mesa eliminada');
          this.loadMesas();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Error al eliminar mesa');
          this.isLoading = false;
        }
      });
    }
  }

  isDatePassed(dateString: string): boolean {
    const examDate = new Date(dateString);
    const now = new Date();
    return examDate < now;
  }


  // --- Add Exam Feature ---

  // Create Turn Modal State
  showCreateTurnModal = false;

  openCreateTurnModal() {
    this.showCreateTurnModal = true;
    this.newTurno = { nombre: '', fechaInicio: '', fechaFin: '' };
  }

  closeCreateTurnModal() {
    this.showCreateTurnModal = false;
  }

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
    // Find the ID of the current Turn (MesaExamen ID)
    // Assuming all rows in this view share the same ID. 
    // Need to handle the edge case where no rows exist yet for this turn locally? 
    // But we are in "Details" view which implies we clicked a card.
    // If the card exists, it came from uniqueTurnos.
    // We need to find the ID associated with this turno string.
    const turnId = this.mesas.find(m => m.turno === this.selectedTurno)?.idMesaExamen;

    if (!turnId) {
      this.alertService.error('No se pudo identificar el turno.');
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
        this.loadMesas();
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Error al agregar mesa');
        this.isLoading = false;
      }
    });
  }
}
