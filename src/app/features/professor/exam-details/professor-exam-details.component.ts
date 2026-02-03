import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { ProfesorDetalleExamenDTO, ProfesorMesaExamenDTO } from '@core/models/professor.models';

@Component({
    selector: 'app-professor-exam-details',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent, DatePipe],
    templateUrl: './professor-exam-details.component.html',
    styleUrl: './styles/professor-exam-details.component.css'
})
export class ProfessorExamDetailsComponent implements OnInit {
    private professorService = inject(ProfessorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    detalles: ProfesorDetalleExamenDTO[] = [];
    isLoading = false;
    error: string | null = null;
    idMesa: string = '';

    mesaNombre: string = 'Detalle de Mesa de Examen';

    ngOnInit(): void {
        this.idMesa = this.route.snapshot.paramMap.get('idMesa') || '';

        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
            this.mesaNombre = navigation.extras.state['mesaNombre'] || this.mesaNombre;
        } else {
            // Fallback attempt to read from history state if page was not refreshed but navigated back/forth
            const state = history.state;
            if (state && state.mesaNombre) {
                this.mesaNombre = state.mesaNombre;
            }
        }

        if (this.idMesa) {
            this.loadDetalles();
        } else {
            this.error = 'Identificador de mesa no válido.';
        }
    }

    loadDetalles(): void {
        this.isLoading = true;

        // If title is missing (e.g. refresh), try to fetch it from the list of mesas
        if (this.mesaNombre === 'Detalle de Mesa de Examen') {
            this.professorService.getMesasExamen().subscribe({
                next: (mesas) => {
                    const mesa = mesas.find(m => m.id === this.idMesa);
                    if (mesa) {
                        this.mesaNombre = mesa.nombre;
                    }
                },
                error: (err) => console.error('Error fetching mesa info', err)
            });
        }

        this.professorService.getDetallesMesaExamen(this.idMesa).subscribe({
            next: (data: ProfesorDetalleExamenDTO[]) => {
                this.detalles = data;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error al cargar detalles de la mesa', err);
                this.error = 'No se pudieron cargar los detalles de la mesa de examen.';
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/professor/exams']);
    }

    getRoleLabel(rol: string): string {
        return rol === 'PRESIDENTE' ? 'Presidente' : 'Vocal';
    }
}
