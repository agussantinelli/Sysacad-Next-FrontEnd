import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { AdminEstadisticasDTO } from '@core/models/admin.models';

@Component({
    selector: 'app-admin-statistics',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './admin-statistics.component.html',
    styleUrl: './styles/admin-statistics.component.css'
})
export class AdminStatisticsComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    stats: AdminEstadisticasDTO | null = null;
    isLoading = false;

    ngOnInit() {
        this.loadStatistics();
    }

    loadStatistics() {
        this.isLoading = true;
        // Default call without filters for now
        this.adminService.obtenerEstadisticas().subscribe({
            next: (data) => {
                this.stats = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading stats', err);
                this.alertService.error('Error al cargar las estadísticas.');
                this.isLoading = false;
            }
        });
    }
}
