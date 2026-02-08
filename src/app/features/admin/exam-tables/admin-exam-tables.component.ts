
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { MesaExamenRequest, MesaExamenResponse } from '@core/models/admin.models';

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
  private router = inject(Router);

  
  turns: MesaExamenResponse[] = [];
  isLoading = false;

  
  showCreateTurnModal = false;
  isEditingTurn = false;
  editingTurnId: string | null = null;
  isEditingActiveTurn = false;
  newTurno: MesaExamenRequest = {
    nombre: '',
    fechaInicio: '',
    fechaFin: ''
  };

  
  showDeleteConfirmation = false;
  turnToDelete: MesaExamenResponse | null = null;

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    console.log('[AdminMain] loadTurnos called');
    this.isLoading = true;
    this.adminService.getAllTurnos().subscribe({
      next: (data) => {
        console.log('[AdminMain] Turns loaded:', data);
        
        this.turns = data.map(t => ({
          ...t,
          detalles: t.detalles || []
        })).sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[AdminMain] Error loading turns:', err);
        this.alertService.error('Error al cargar turnos');
        this.isLoading = false;
      }
    });
  }

  selectTurno(turno: MesaExamenResponse) {
    this.router.navigate(['/admin/exam-tables', turno.id]);
  }

  getMesasCount(turno: MesaExamenResponse): number {
    return turno.detalles ? turno.detalles.length : 0;
  }

  isTurnActive(turno: MesaExamenResponse): boolean {
    const now = new Date();
    const start = new Date(turno.fechaInicio);
    const end = new Date(turno.fechaFin);
    end.setHours(23, 59, 59);
    return now >= start && now <= end;
  }

  isTurnPast(turno: MesaExamenResponse): boolean {
    const now = new Date();
    const end = new Date(turno.fechaFin);
    end.setHours(23, 59, 59);
    return now > end;
  }

  

  openCreateTurnModal() {
    this.isEditingTurn = false;
    this.editingTurnId = null;
    this.isEditingActiveTurn = false;
    this.newTurno = { nombre: '', fechaInicio: '', fechaFin: '' };
    this.showCreateTurnModal = true;
  }

  closeCreateTurnModal() {
    this.showCreateTurnModal = false;
  }

  editTurno(turno: MesaExamenResponse, event: Event) {
    event.stopPropagation();
    this.isEditingTurn = true;
    this.editingTurnId = turno.id;
    this.isEditingActiveTurn = this.isTurnActive(turno);

    const startDate = turno.fechaInicio ? turno.fechaInicio.split('T')[0] : '';
    const endDate = turno.fechaFin ? turno.fechaFin.split('T')[0] : '';

    this.newTurno = {
      nombre: turno.nombre,
      fechaInicio: startDate,
      fechaFin: endDate
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
    
    const hasActiveInscriptions = (turno.cantidadInscriptos || 0) > 0 ||
      (turno.detalles && turno.detalles.some(d => (d.cantidadInscriptos || 0) > 0));

    if (hasActiveInscriptions) {
      this.alertService.error('No se puede eliminar un turno con inscripciones activas.');
      return;
    }

    this.turnToDelete = turno;
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    if (this.turnToDelete) {
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
          this.alertService.error('Error al eliminar turno');
          this.isLoading = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.turnToDelete = null;
  }
}
