import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { AdminInscripcionDTO } from '@core/models/admin.models';

@Component({
    selector: 'app-admin-inscriptions',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './admin-inscriptions.component.html',
    styleUrl: './styles/admin-inscriptions.component.css'
})
export class AdminInscriptionsComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);
    private router = inject(Router);

    inscripciones: AdminInscripcionDTO[] = [];
    isLoading = false;

    ngOnInit() {
        this.loadInscriptions();
    }

    loadInscriptions() {
        this.isLoading = true;
        this.adminService.obtenerInscripciones().subscribe({
            next: (data) => {
                this.inscripciones = data;
                this.isLoading = false;
                // Apply initial sort if set, or default
                if (this.sortColumn) {
                    this.sortData();
                }
            },
            error: (err) => {
                console.error('Error loading inscriptions', err);
                this.alertService.error('Error al cargar el listado de inscripciones.');
                this.isLoading = false;
            }
        });
    }

    // Sorting
    sortColumn: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    onSort(column: string) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sortData();
    }

    sortData() {
        if (!this.sortColumn) return;

        this.inscripciones.sort((a, b) => {
            let valA: any = '';
            let valB: any = '';

            switch (this.sortColumn) {
                case 'fecha':
                    valA = new Date(a.fechaInscripcion).getTime();
                    valB = new Date(b.fechaInscripcion).getTime();
                    break;
                case 'alumno':
                    valA = (a.apellido + ' ' + a.nombre).toLowerCase();
                    valB = (b.apellido + ' ' + b.nombre).toLowerCase();
                    break;
                case 'materia':
                    valA = a.nombreMateria.toLowerCase();
                    valB = b.nombreMateria.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    goToCreate() {
        this.router.navigate(['/admin/inscriptions/create']);
    }

    goToProfile(userId: string) {
        this.router.navigate(['/admin/profile', userId]);
    }

    deleteInscription(item: AdminInscripcionDTO) {
        if (!confirm(`¿Está seguro de eliminar la inscripción de ${item.nombre} ${item.apellido} en ${item.nombreMateria}? Esta acción no se puede deshacer.`)) {
            return;
        }

        this.adminService.eliminarInscripcion(item.id, item.tipo).subscribe({
            next: () => {
                this.alertService.success('Inscripción eliminada correctamente.');
                this.loadInscriptions(); // Reload list
            },
            error: (err) => {
                console.error('Error deleting inscription', err);
                this.alertService.error('Error al eliminar la inscripción.');
            }
        });
    }

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        // Adjust based on your backend config
        return `http://localhost:8080/${relativePath.startsWith('/') ? relativePath.substring(1) : relativePath}`;
    }
}
