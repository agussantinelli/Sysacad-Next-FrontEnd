import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { MateriaProfesorDTO } from '@core/models/professor.models';

@Component({
    selector: 'app-professor-subjects',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent, RouterLink],
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
            next: (data: MateriaProfesorDTO[]) => {
                this.materias = data;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error loading subjects', err);
                this.error = 'No se pudieron cargar las materias asignadas. Intente nuevamente.';
                this.isLoading = false;
            }
        });
    }

    getLevelLabel(level: number): string {
        return `${level}° Año`;
    }

    getCargoLabel(cargo: string): string {
        const cargoLabels: { [key: string]: string } = {
            'JEFE_CATEDRA': 'Jefe de Cátedra',
            'DOCENTE': 'Docente'
        };
        return cargoLabels[cargo] || cargo;
    }
}
