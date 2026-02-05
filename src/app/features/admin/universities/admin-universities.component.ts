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
  templateUrl: './admin-universities.component.html',
  styleUrl: './styles/admin-universities.component.css'
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
