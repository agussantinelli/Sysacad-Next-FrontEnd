import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { AlertService } from '@core/services/alert.service';
import { InscripcionExamenResponse } from '@core/models/inscripcion-examen.models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
    selector: 'app-my-inscriptions',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, PageLayoutComponent, ConfirmationModalComponent, DateFormatPipe],
    templateUrl: './my-inscriptions.component.html',
    styleUrls: ['./styles/my-inscriptions.component.css']
})
export class MyInscriptionsComponent implements OnInit {
    private inscripcionService = inject(InscripcionExamenService);
    private alertService = inject(AlertService);

    @Input() isWidget: boolean = false;

    myInscriptions: InscripcionExamenResponse[] = [];
    isLoading: boolean = false;

    
    showConfirmModal: boolean = false;
    inscriptionIdToUnenroll: string | null = null;

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
                if (!this.isWidget) {
                    this.alertService.error('Error al cargar inscripciones.');
                }
                this.isLoading = false;
            }
        });
    }

    onUnenrollClick(inscriptionId: string) {
        this.inscriptionIdToUnenroll = inscriptionId;
        this.showConfirmModal = true;
    }

    onConfirmUnenroll() {
        if (!this.inscriptionIdToUnenroll) return;

        this.showConfirmModal = false;
        this.isLoading = true;

        this.inscripcionService.bajaInscripcion(this.inscriptionIdToUnenroll).subscribe({
            next: () => {
                this.alertService.success('Baja de inscripción exitosa.');
                this.loadMyInscriptions();
                this.inscriptionIdToUnenroll = null;
            },
            error: (err) => {
                console.error('Error un-enrolling:', err);
                this.alertService.error('Error al dar de baja la inscripción.');
                this.isLoading = false;
                this.inscriptionIdToUnenroll = null;
            }
        });
    }

    onCancelUnenroll() {
        this.showConfirmModal = false;
        this.inscriptionIdToUnenroll = null;
    }
}
