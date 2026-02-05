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
  templateUrl: './admin-careers.component.html',
  styleUrl: './styles/admin-careers.component.css'
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
