import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AvisoService } from '@core/services/aviso.service';
import { AvisoResponse } from '@core/models/aviso.models';
import { AlertService } from '@core/services/alert.service';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './notifications.component.html',
    styleUrls: ['./styles/notifications.component.css']
})
export class NotificationsComponent implements OnInit {
    private avisoService = inject(AvisoService);
    private alertService = inject(AlertService);

    avisos: AvisoResponse[] = [];
    isLoading: boolean = false;

    ngOnInit(): void {
        this.loadAvisos();
    }

    loadAvisos() {
        this.isLoading = true;
        this.avisoService.listarAvisos().subscribe({
            next: (data) => {
                // Sort by date descending (newest first)
                this.avisos = data.sort((a, b) =>
                    new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
                );
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading notices:', err);
                this.alertService.error('No se pudieron cargar los avisos.');
                this.isLoading = false;
            }
        });
    }

    markAsRead(aviso: AvisoResponse) {
        if (aviso.visto) return; // Already read

        this.avisoService.marcarLeido(aviso.id).subscribe({
            next: () => {
                aviso.visto = true; // Update local state
                // Optional: Update global unread count if we have one
            },
            error: (err) => {
                console.error('Error marking as read:', err);
            }
        });
    }
}
