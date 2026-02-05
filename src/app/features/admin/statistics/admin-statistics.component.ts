import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { AdminEstadisticasDTO, FacultadAdminDTO, CarreraAdminDTO } from '@core/models/admin.models';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-admin-statistics',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, NgxChartsModule, FormsModule],
    templateUrl: './admin-statistics.component.html',
    styleUrl: './styles/admin-statistics.component.css'
})
export class AdminStatisticsComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    stats: AdminEstadisticasDTO | null = null;
    isLoading = false;

    // Filters
    selectedAnio: number | null = new Date().getFullYear();
    selectedFacultad: string = '';
    selectedCarrera: string = '';

    facultades: FacultadAdminDTO[] = [];
    carreras: CarreraAdminDTO[] = [];

    // Charts Data
    examChartData: any[] = [];
    studentChartData: any[] = [];

    // Color Schemes
    examColorScheme: Color = {
        name: 'examScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#10b981', '#ef4444', '#f59e0b'] // Green (Approved), Red (Failed), Amber (Absent)
    };

    studentColorScheme: Color = {
        name: 'studentScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#3b82f6', '#8b5cf6', '#6b7280'] // Blue (Regular), Purple (Promoted), Gray (Free)
    };

    ngOnInit() {
        this.loadFiltersData();
        this.loadStatistics();
    }

    loadFiltersData() {
        // Load Faculties and Careers for filters
        this.adminService.getAllFacultades().subscribe(data => this.facultades = data);
        this.adminService.getAllCarreras().subscribe(data => this.carreras = data);
    }

    loadStatistics() {
        this.isLoading = true;
        this.adminService.obtenerEstadisticas(
            this.selectedAnio || undefined,
            this.selectedFacultad || undefined,
            this.selectedCarrera || undefined
        ).subscribe({
            next: (data) => {
                this.stats = data;
                this.processChartData(data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading stats', err);
                this.alertService.error('Error al cargar las estadísticas.');
                this.isLoading = false;
            }
        });
    }

    applyFilters() {
        this.loadStatistics();
    }

    processChartData(data: AdminEstadisticasDTO) {
        // 1. Exam Performance Pie Chart
        this.examChartData = [
            { name: 'Aprobados', value: data.cantidadAprobadosExamen },
            { name: 'Desaprobados', value: data.cantidadDesaprobadosExamen },
            { name: 'Ausentes', value: data.cantidadAusentesExamen }
        ];

        // 2. Student Status Bar Chart
        this.studentChartData = [
            { name: 'Regulares', value: data.cantidadRegulares },
            { name: 'Promocionados', value: data.cantidadPromocionados },
            { name: 'Libres', value: data.cantidadLibres }
        ];
    }
}
