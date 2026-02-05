import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { CarreraAdminDTO } from '@core/models/admin.models';

@Component({
    selector: 'app-admin-careers',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    template: `
    <app-page-layout title="Gestión de Carreras" icon="school">
      <div class="content-container">
        
        <div class="stats-overview">
            <div class="stat-box" *ngFor="let carrera of carreras">
                <h4>{{ carrera.alias }}</h4>
                <p class="count">{{ carrera.cantidadMatriculados }}</p>
                <span class="label">Matriculados</span>
            </div>
        </div>

        <div class="card list-card">
          @if (isLoading) {
            <app-loading-spinner></app-loading-spinner>
          } @else {
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Alias</th>
                    <th>Matriculados</th>
                    <th>Planes</th>
                  </tr>
                </thead>
                <tbody>
                  @for (carrera of carreras; track carrera.id) {
                    <tr>
                      <td>{{ carrera.nombre }}</td>
                      <td>{{ carrera.alias }}</td>
                      <td>{{ carrera.cantidadMatriculados }}</td>
                      <td>
                        <!-- Placeholder for plan details interaction -->
                        <button class="btn-outline">Ver Planes</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="empty-cell">No hay carreras registradas.</td>
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
    .stats-overview {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    .stat-box {
        background: var(--surface-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        flex: 1;
        min-width: 200px;
        text-align: center;
    }
    .stat-box h4 {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    .stat-box .count {
        font-size: 2rem;
        font-weight: 700;
        margin: 0.5rem 0;
        color: var(--text-primary);
    }
    .stat-box .label {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    .card {
      background: var(--surface-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
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
    .btn-outline {
        background: transparent;
        border: 1px solid var(--utn-blue);
        color: var(--utn-blue);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-outline:hover {
        background: rgba(37, 99, 235, 0.1);
    }
    .empty-cell {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
  `]
})
export class AdminCareersComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    carreras: CarreraAdminDTO[] = [];
    isLoading = false;

    ngOnInit() {
        this.loadCarreras();
    }

    loadCarreras() {
        this.isLoading = true;
        this.adminService.getAllCarreras().subscribe({
            next: (data) => {
                this.carreras = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar carreras');
                this.isLoading = false;
            }
        });
    }
}
