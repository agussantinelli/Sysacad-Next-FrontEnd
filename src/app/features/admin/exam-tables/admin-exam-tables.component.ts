import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { MesaAdminDTO, MesaExamenRequest } from '@core/models/admin.models';

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
        this.newTurno = { nombre: '', fechaInicio: '', fechaFin: '' };
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
}
