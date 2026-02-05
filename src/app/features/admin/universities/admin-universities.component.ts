import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertService } from '@core/services/alert.service';
import { AdminService } from '@core/services/admin.service';
import { FacultadAdminDTO, FacultadRequest } from '@core/models/admin.models';

@Component({
    selector: 'app-admin-universities',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent],
    template: `
    <app-page-layout title="Gestión de Universidades" icon="school">
      <div class="content-container">
        
        <!-- Create Form -->
        <div class="card create-form">
          <h3>Nueva Facultad/Universidad</h3>
          <div class="form-row">
            <div class="form-group">
                <label>Ciudad</label>
                <input type="text" [(ngModel)]="newFacultad.ciudad" class="form-control" placeholder="Ej: Rosario">
            </div>
            <div class="form-group">
                <label>Provincia</label>
                <input type="text" [(ngModel)]="newFacultad.provincia" class="form-control" placeholder="Ej: Santa Fe">
            </div>
            <button class="btn-primary" (click)="create()" [disabled]="!newFacultad.ciudad || !newFacultad.provincia || isLoading">
              <span class="material-icons">add</span> Agregar
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
                    <th>Nombre Completo</th>
                    <th>Ubicación</th>
                    <th>Matriculados</th>
                    <th>Carreras</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (facultad of facultades; track facultad.id) {
                    <tr>
                      <td>{{ facultad.nombreCompleto }}</td>
                      <td>{{ facultad.ciudad }}, {{ facultad.provincia }}</td>
                      <td>{{ facultad.cantidadMatriculados }}</td>
                      <td>
                        <div class="tags">
                            @for (carrera of facultad.carreras; track carrera) {
                                <span class="tag">{{ carrera }}</span>
                            }
                        </div>
                      </td>
                      <td>
                        <button class="icon-btn delete" (click)="delete(facultad)" title="Eliminar">
                          <span class="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="empty-cell">No hay universidades registradas.</td>
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
    }
    .form-group {
      flex: 1;
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
    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .tag {
        background: var(--bg-hover);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    .icon-btn.delete {
      color: var(--error);
      background: none;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .icon-btn.delete:hover {
        opacity: 0.8;
    }
    .empty-cell {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
  `]
})
export class AdminUniversitiesComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    facultades: FacultadAdminDTO[] = [];
    isLoading = false;

    newFacultad: FacultadRequest = {
        ciudad: '',
        provincia: ''
    };

    ngOnInit() {
        this.loadFacultades();
    }

    loadFacultades() {
        this.isLoading = true;
        this.adminService.getAllFacultades().subscribe({
            next: (data) => {
                this.facultades = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar universidades');
                this.isLoading = false;
            }
        });
    }

    create() {
        this.isLoading = true;
        this.adminService.createFacultad(this.newFacultad).subscribe({
            next: () => {
                this.alertService.success('Universidad creada correctamente');
                this.newFacultad = { ciudad: '', provincia: '' };
                this.loadFacultades();
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al crear universidad');
                this.isLoading = false;
            }
        });
    }

    delete(facultad: FacultadAdminDTO) {
        if (confirm(`¿Está seguro de eliminar la Facultad de ${facultad.ciudad}?`)) {
            this.isLoading = true;
            this.adminService.deleteFacultad(facultad.id).subscribe({
                next: () => {
                    this.alertService.success('Universidad eliminada');
                    this.loadFacultades();
                },
                error: (err) => {
                    console.error(err);
                    this.alertService.error('Error al eliminar universidad');
                    this.isLoading = false;
                }
            });
        }
    }
}
