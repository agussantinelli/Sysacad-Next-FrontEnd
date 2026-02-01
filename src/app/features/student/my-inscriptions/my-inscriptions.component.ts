import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { AlertService } from '@core/services/alert.service';
import { InscripcionExamenResponse } from '@core/models/inscripcion-examen.models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';

@Component({
    selector: 'app-my-inscriptions',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, PageLayoutComponent],
    templateUrl: './my-inscriptions.component.html',
    styleUrls: ['./my-inscriptions.component.css']
})
export class MyInscriptionsComponent implements OnInit {
    private inscripcionService = inject(InscripcionExamenService);
    private alertService = inject(AlertService);

    @Input() isWidget: boolean = false; // To simplify view if used as widget

    myInscriptions: InscripcionExamenResponse[] = [];
    isLoading: boolean = false;

    ngOnInit(): void {
        this.loadMyInscriptions();
    }

    loadMyInscriptions() {
        this.isLoading = true;
        this.inscripcionService.misInscripciones().subscribe({
            next: (data) => {
                this.myInscriptions = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading inscriptions:', err);
                if (!this.isWidget) { // Don't spam alerts on dashboard
                    this.alertService.error('Error al cargar inscripciones.');
                }
                this.isLoading = false;
            }
        });
    }

    onUnenroll(inscriptionId: string) {
        if (!confirm('¿Estás seguro que deseas darte de baja de este examen?')) return;

        this.isLoading = true;
        this.inscripcionService.bajaInscripcion(inscriptionId).subscribe({
            next: () => {
                this.alertService.success('Baja de inscripción exitosa.');
                this.loadMyInscriptions();
            },
            error: (err) => {
                console.error('Error un-enrolling:', err);
                this.alertService.error('Error al dar de baja la inscripción.');
                this.isLoading = false;
            }
        });
    }
}
