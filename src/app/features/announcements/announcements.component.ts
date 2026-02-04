import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AvisoService } from '@core/services/aviso.service';
import { AvisoResponse } from '@core/models/aviso.models';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UsuarioResponse } from '@core/models/usuario.models';

@Component({
    selector: 'app-announcements',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, FormsModule],
    templateUrl: './announcements.component.html',
    styleUrls: ['./styles/announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
    private avisoService = inject(AvisoService);
    private alertService = inject(AlertService);
    private authService = inject(AuthService);
    private router = inject(Router);

    avisos: AvisoResponse[] = [];
    isLoading: boolean = false;
    usuario: UsuarioResponse | null = null;

    // Filters
    statusFilter: 'all' | 'read' | 'unread' = 'all';
    timeFilter: 'all' | 'today' | 'week' | 'month' | 'year' = 'all';


    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.usuario = user;
        });
        this.loadAvisos();
    }

    loadAvisos() {
        this.isLoading = true;
        this.avisoService.listarAvisos().subscribe({
            next: (data) => {
                // Sort by date descending (newest first)
                this.avisos = data.sort((a: AvisoResponse, b: AvisoResponse) =>
                    new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
                );
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error loading notices:', err);
                this.alertService.error('No se pudieron cargar los avisos.');
                this.isLoading = false;
            }
        });
    }

    get filteredAvisos(): AvisoResponse[] {
        return this.avisos.filter(aviso => {
            // Status Filter
            if (this.statusFilter === 'read' && !aviso.visto) return false;
            if (this.statusFilter === 'unread' && aviso.visto) return false;

            // Time Filter
            if (this.timeFilter !== 'all') {
                const avisoDate = new Date(aviso.fechaEmision);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - avisoDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (this.timeFilter === 'today') {
                    // Check if strictly same day
                    return avisoDate.getDate() === now.getDate() &&
                        avisoDate.getMonth() === now.getMonth() &&
                        avisoDate.getFullYear() === now.getFullYear();
                }
                if (this.timeFilter === 'week' && diffDays > 7) return false;
                if (this.timeFilter === 'month' && diffDays > 30) return false;
                if (this.timeFilter === 'year' && diffDays > 365) return false;
            }

            return true;
        });
    }

    markAsRead(aviso: AvisoResponse) {
        if (aviso.visto) return; // Already read

        this.avisoService.marcarLeido(aviso.id).subscribe({
            next: () => {
                aviso.visto = true; // Update local state
            },
            error: (err: any) => {
                console.error('Error marking as read:', err);
            }
        });
    }

    get canCreate(): boolean {
        return this.usuario?.rol === 'ADMIN';
    }

    goToCreate() {
        this.router.navigate(['/admin/avisos/crear']);
    }

    toggleState(aviso: AvisoResponse) {
        const nuevoEstado = aviso.estado === 'ACTIVO' ? 'OCULTO' : 'ACTIVO';

        this.avisoService.cambiarEstado(aviso.id, nuevoEstado).subscribe({
            next: (avisoActualizado) => {
                aviso.estado = avisoActualizado.estado;
                this.alertService.success(`Aviso ${nuevoEstado === 'ACTIVO' ? 'visible' : 'oculto'} correctamente.`);
            },
            error: (err) => {
                console.error('Error changing state:', err);
                this.alertService.error('Error al cambiar el estado del aviso.');
            }
        });
    }
}
