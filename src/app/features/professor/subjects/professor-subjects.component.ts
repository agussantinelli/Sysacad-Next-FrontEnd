import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { MateriaProfesorDTO } from '@core/models/professor.models';

@Component({
    selector: 'app-professor-subjects',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent],
    templateUrl: './professor-subjects.component.html',
    styleUrl: './styles/professor-subjects.component.css'
})
export class ProfessorSubjectsComponent implements OnInit {
    private professorService = inject(ProfessorService);

    materias: MateriaProfesorDTO[] = [];
    isLoading = false;
    error: string | null = null;

    ngOnInit(): void {
        this.loadMaterias();
    }

    loadMaterias(): void {
        this.isLoading = true;
        this.error = null;

        this.professorService.getMisMaterias().subscribe({
            next: (data) => {
                this.materias = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading subjects', err);
                this.error = 'No se pudieron cargar las materias asignadas. Intente nuevamente.';
                this.isLoading = false;
            }
        });
    }

    getLevelLabel(level: number): string {
        return `${level}° Año`;
    }
}
