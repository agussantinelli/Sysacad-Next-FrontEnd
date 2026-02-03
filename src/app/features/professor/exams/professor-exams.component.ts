import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { ProfesorMesaExamenDTO } from '@core/models/professor.models';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-professor-exams',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent, DatePipe],
    templateUrl: './professor-exams.component.html',
    styleUrl: './styles/professor-exams.component.css'
})
export class ProfessorExamsComponent implements OnInit {
    private professorService = inject(ProfessorService);
    private router = inject(Router);

    mesas: ProfesorMesaExamenDTO[] = [];
    isLoading = false;
    error: string | null = null;

    ngOnInit(): void {
        this.loadMesas();
    }

    sortColumn: keyof ProfesorMesaExamenDTO = 'fechaInicio';
    sortDirection: 'asc' | 'desc' = 'asc';

    loadMesas(): void {
        this.isLoading = true;
        this.professorService.getMesasExamen().subscribe({
            next: (data: ProfesorMesaExamenDTO[]) => {
                this.mesas = data;
                this.sortMesas();
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error al cargar mesas de examen', err);
                this.error = 'No se pudieron cargar las mesas de examen. Intente nuevamente más tarde.';
                this.isLoading = false;
            }
        });
    }

    sortData(column: keyof ProfesorMesaExamenDTO): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sortMesas();
    }

    sortMesas(): void {
        this.mesas.sort((a, b) => {
            const valueA = a[this.sortColumn];
            const valueB = b[this.sortColumn];

            if (valueA < valueB) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    viewDetails(mesa: ProfesorMesaExamenDTO): void {
        this.router.navigate(['/professor/exams', mesa.id], {
            state: { mesaNombre: mesa.nombre }
        });
    }
}
