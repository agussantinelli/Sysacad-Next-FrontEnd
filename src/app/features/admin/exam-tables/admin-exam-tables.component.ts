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
    template: `
    <app-page-layout title="Gestión de Mesas de Examen" icon="assignment">
      <div class="content-container">
        
        <!-- Create Turno -->
        <div class="card create-form">
          <h3>Nuevo Turno de Examen</h3>
          <div class="form-row">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" [(ngModel)]="newTurno.nombre" class="form-control" placeholder="Ej: Febrero 2026">
            </div>
            <div class="form-group">
                <label>Inicio</label>
                <input type="date" [(ngModel)]="newTurno.fechaInicio" class="form-control">
            </div>
            <div class="form-group">
                <label>Fin</label>
                <input type="date" [(ngModel)]="newTurno.fechaFin" class="form-control">
            </div>
            <button class="btn-primary" (click)="createTurno()" 
                [disabled]="!newTurno.nombre || !newTurno.fechaInicio || !newTurno.fechaFin || isLoading">
              <span class="material-icons">add</span> Crear Turno
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="card list-card">
          @if (isLoading) {
            <app-loading-spinner></app-loading-spinner>
          } @else {
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Turno</th>
                    <th>Materia</th>
                    <th>Fecha Examen</th>
                    <th>Inscriptos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (mesa of mesas; track mesa.idMesaExamen + '-' + mesa.nroDetalle) {
                    <tr>
                      <td>{{ mesa.turno }}</td>
                      <td>{{ mesa.materia }}</td>
                      <td>{{ mesa.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                      <td>{{ mesa.cantidadInscriptos }}</td>
                      <td>
                        <span class="badge" [class.open]="mesa.abierta" [class.closed]="!mesa.abierta">
                            {{ mesa.abierta ? 'Abierta' : 'Cerrada' }}
                        </span>
                      </td>
                      <td>
                        <button class="icon-btn delete" (click)="deleteDetalle(mesa)" title="Eliminar Mesa">
                          <span class="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="empty-cell">No hay mesas de examen configuradas.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

      </div>
    </app-page-layout>
  `,
    styles: [`
    .content-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .card {
      background: var(--surface-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
    }
    .create-form h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .form-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .form-group {
      flex: 1;
      min-width: 200px;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--bg-input);
      border: 1px solid var(--border-input);
      color: var(--text-primary);
    }
    .btn-primary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      background: var(--utn-blue);
      color: white;
      border: none;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      color: var(--text-primary);
    }
    .data-table th, .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    .data-table th {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge.open {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }
    .badge.closed {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
    .icon-btn.delete {
      color: var(--error);
      background: none;
      border: none;
      cursor: pointer;
    }
    .empty-cell {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
  `]
})
export class AdminExamTablesComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    mesas: MesaAdminDTO[] = [];
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
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar mesas');
                this.isLoading = false;
            }
        });
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
