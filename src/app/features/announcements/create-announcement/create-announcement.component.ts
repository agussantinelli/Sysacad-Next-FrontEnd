import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { AvisoService } from '@core/services/aviso.service';
import { AlertService } from '@core/services/alert.service';
import { AvisoRequest } from '@core/models/aviso.models';

@Component({
    selector: 'app-create-announcement',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent],
    templateUrl: './create-announcement.component.html',
    styleUrl: './styles/create-announcement.component.css'
})
export class CreateAnnouncementComponent {
    private avisoService = inject(AvisoService);
    private alertService = inject(AlertService);
    private router = inject(Router);

    aviso: AvisoRequest = {
        titulo: '',
        descripcion: '',
        estado: 'ACTIVO'
    };

    isLoading = false;

    onSubmit() {
        if (!this.aviso.titulo || !this.aviso.descripcion) {
            this.alertService.error('Por favor completa los campos obligatorios.');
            return;
        }

        this.isLoading = true;
        this.avisoService.crearAviso(this.aviso).subscribe({
            next: () => {
                this.alertService.success('Aviso creado exitosamente.');
                this.router.navigate(['/admin/avisos']);
            },
            error: (err) => {
                console.error('Error al crear aviso:', err);
                this.alertService.error('Ocurrió un error al crear el aviso.');
                this.isLoading = false;
            }
        });
    }

    cancel() {
        this.router.navigate(['/admin/avisos']);
    }
}
