import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '@core/services/professor.service';
import { ProfesorEstadisticasDTO, MateriaProfesorDTO } from '@core/models/professor.models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-professor-exam-statistics',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, FormsModule, LoadingSpinnerComponent, AlertMessageComponent, NgxChartsModule],
    templateUrl: './professor-exam-statistics.component.html',
    styleUrls: ['./styles/professor-exam-statistics.component.css']
})
export class ProfessorExamStatisticsComponent implements OnInit {
    private professorService = inject(ProfessorService);

    stats: ProfesorEstadisticasDTO | null = null;
    years: number[] = [];
    subjects: MateriaProfesorDTO[] = [];

    // Filters
    selectedYear: number | null = null;
    selectedSubject: string = '';

    isLoading = true;
    error: string | null = null;

    // Chart Data
    courseStatusData: any[] = [];

    // Chart Colors (Green for Promoted, Orange for Regular, Red for Free)
    colorScheme: Color = {
        name: 'academicStatus',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#10b981', '#f59e0b', '#ef4444']
    };

    ngOnInit(): void {
        this.loadFilters();
        this.loadStats();
    }

    loadFilters(): void {
        // Load available years
        this.professorService.getAniosEstadisticas().subscribe({
            next: (years) => this.years = years,
            error: (err) => console.error('Error loading years', err)
        });

        // Load subjects
        this.professorService.getMisMaterias().subscribe({
            next: (subjects) => this.subjects = subjects,
            error: (err) => console.error('Error loading subjects', err)
        });
    }

    loadStats(): void {
        this.isLoading = true;
        this.error = null;
        this.stats = null;

        const request$ = this.selectedSubject
            ? this.professorService.getEstadisticasMateria(this.selectedSubject, this.selectedYear || undefined)
            : this.professorService.getEstadisticasGeneral(this.selectedYear || undefined);

        request$.subscribe({
            next: (data) => {
                this.stats = data;

                // Populate Chart Data
                this.courseStatusData = [
                    { name: 'Promocionados', value: data.cantidadPromocionados },
                    { name: 'Regulares', value: data.cantidadRegulares },
                    { name: 'Libres', value: data.cantidadLibres }
                ];

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading stats', err);
                this.error = 'No se pudieron cargar las estadísticas.';
                this.isLoading = false;
            }
        });
    }

    onFilterChange(): void {
        this.loadStats();
    }
}
