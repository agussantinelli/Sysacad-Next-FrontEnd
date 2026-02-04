import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ReporteService } from '@core/services/reporte.service';
import { ReporteCertificadoDTO } from '@core/models/reporte.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    LoadingSpinnerComponent,
    AlertMessageComponent,
    DatePipe
  ],
  templateUrl: './reports.component.html',
  styleUrl: './styles/reports.component.css'
})
export class ReportsComponent implements OnInit {
  private reporteService = inject(ReporteService);

  reports: ReporteCertificadoDTO[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.reporteService.getCertificadosHistory().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports', err);
        this.error = 'No se pudo cargar el historial de reportes. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
