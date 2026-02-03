import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';

@Component({
    selector: 'app-professor-cert',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent],
    templateUrl: './professor-cert.component.html',
    styleUrl: './styles/professor-cert.component.css'
})
export class ProfessorCertComponent {
    private professorService = inject(ProfessorService);
    private alertService = inject(AlertService);

    isLoading = false;

    downloadCertificate() {
        this.isLoading = true;
        this.professorService.getServicesCertificate().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Certificado_De_Servicios.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error downloading certificate', err);
                this.alertService.error('Error al descargar el certificado');
                this.isLoading = false;
            }
        });
    }
}
