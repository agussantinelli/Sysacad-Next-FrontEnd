import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { StudentService } from '@core/services/student.service';
import { AlertService } from '@core/services/alert.service'; // Assuming alert service is available

@Component({
    selector: 'app-regular-cert',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent],
    templateUrl: './regular-cert.component.html',
    styleUrl: './styles/regular-cert.component.css'
})
export class RegularCertComponent {
    private studentService = inject(StudentService);
    private alertService = inject(AlertService);

    isLoading = false;

    downloadCertificate() {
        this.isLoading = true;
        this.studentService.getRegularCertificate().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Certificado_Alumno_Regular.pdf';
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
