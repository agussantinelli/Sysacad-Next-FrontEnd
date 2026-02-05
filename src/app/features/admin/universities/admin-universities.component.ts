import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertService } from '@core/services/alert.service';
import { AdminService } from '@core/services/admin.service';
import { FacultadAdminDTO, FacultadRequest } from '@core/models/admin.models';
import { CarreraResponse } from '@core/models/carrera.models';

@Component({
  selector: 'app-admin-universities',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent],
  templateUrl: './admin-universities.component.html',
  styleUrl: './styles/admin-universities.component.css'
})
export class AdminUniversitiesComponent implements OnInit {
  private adminService = inject(AdminService);
  private alertService = inject(AlertService);

  facultades: FacultadAdminDTO[] = [];
  carrerasSimples: CarreraResponse[] = [];
  selectedFacultadId: string | null = null;
  selectedCarreraId: string = '';
  showModal: boolean = false;

  isLoading = false;

  newFacultad: FacultadRequest = {
    ciudad: '',
    provincia: ''
  };

  ngOnInit() {
    this.loadFacultades();
    this.loadCarrerasSimples();
  }

  loadCarrerasSimples() {
    this.adminService.getCarrerasSimples().subscribe({
      next: (data) => this.carrerasSimples = data,
      error: (err) => console.error('Error loading careers', err)
    });
  }

  openAssociationModal(facultad: FacultadAdminDTO) {
    this.selectedFacultadId = facultad.id;
    this.selectedCarreraId = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedFacultadId = null;
    this.selectedCarreraId = '';
  }

  asociarCarrera() {
    if (!this.selectedFacultadId || !this.selectedCarreraId) return;

    this.isLoading = true;
    this.adminService.asociarCarreraFacultad(this.selectedCarreraId, this.selectedFacultadId).subscribe({
      next: () => {
        this.alertService.success('Carrera asociada exitosamente');
        this.loadFacultades(); // Reload to see the new career in the list
        this.closeModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Error al asociar carrera');
        this.isLoading = false;
      }
    });
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
        const backendMessage = err.response?.data?.message || 'Error al crear universidad';
        this.alertService.error(backendMessage);
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
