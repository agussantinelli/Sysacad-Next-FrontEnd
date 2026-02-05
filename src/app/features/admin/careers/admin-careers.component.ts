import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { CarreraAdminDTO } from '@core/models/admin.models';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-careers',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent],
  templateUrl: './admin-careers.component.html',
  styleUrl: './styles/admin-careers.component.css'
})
export class AdminCareersComponent implements OnInit {
  private adminService = inject(AdminService);
  private alertService = inject(AlertService);

  carreras: CarreraAdminDTO[] = [];
  isLoading = false;
  showModal = false;

  newCarrera = {
    nombre: '',
    alias: '',
    horasElectivasRequeridas: 0
  };

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

  openCreateModal() {
    this.newCarrera = { nombre: '', alias: '', horasElectivasRequeridas: 0 };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  createCarrera() {
    if (!this.newCarrera.nombre || !this.newCarrera.alias) return;

    this.isLoading = true;
    this.adminService.crearCarrera(this.newCarrera).subscribe({
      next: () => {
        this.alertService.success('Carrera creada exitosamente');
        this.closeModal();
        this.loadCarreras();
      },
      error: (err) => {
        console.error(err);
        const backendMessage = err.response?.data?.message || 'Error al crear carrera';
        this.alertService.error(backendMessage);
        this.isLoading = false;
      }
    });
  }

  viewPlans(carrera: CarreraAdminDTO) {
    // Logic to navigate to plans or show plans
    // For now just logging, as the requirement was mainly about the button state
    console.log('View plans for', carrera.alias);
  }
}
