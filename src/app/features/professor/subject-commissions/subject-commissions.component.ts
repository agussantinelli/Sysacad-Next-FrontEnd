import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { QuickMessageModalComponent } from '@shared/components/quick-message-modal/quick-message-modal.component';
import { ProfessorService } from '@core/services/professor.service';
import { ComisionHorarioDTO } from '@core/models/professor.models';

@Component({
    selector: 'app-subject-commissions',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent, QuickMessageModalComponent],
    templateUrl: './subject-commissions.component.html',
    styleUrl: './styles/subject-commissions.component.css'
})
export class SubjectCommissionsComponent implements OnInit {
    private professorService = inject(ProfessorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    comisiones: ComisionHorarioDTO[] = [];
    isLoading = false;
    error: string | null = null;
    subjectName = '';
    idMateria = '';

    showQuickMessageModal = false;
    selectedCommission: ComisionHorarioDTO | null = null;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.idMateria = params.get('idMateria') || '';

            if (this.idMateria) {
                this.subjectName = this.route.snapshot.queryParamMap.get('name') || 'Materia';
                this.loadComisiones();
            } else {
                this.error = 'ID de materia no válido';
            }
        });
    }

    loadComisiones(): void {
        this.isLoading = true;
        this.error = null;

        this.professorService.getComisionesByMateria(this.idMateria).subscribe({
            next: (data: ComisionHorarioDTO[]) => {
                this.comisiones = data;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error loading commissions', err);
                this.error = 'No se pudieron cargar las comisiones. Intente nuevamente.';
                this.isLoading = false;
            }
        });
    }

    goToGrading(idComision: string): void {
        this.router.navigate(['/professor/commissions', idComision, 'subjects', this.idMateria, 'grading']);
    }

    openMessageModal(comision: ComisionHorarioDTO) {
        this.selectedCommission = comision;
        this.showQuickMessageModal = true;
    }

    closeMessageModal() {
        this.showQuickMessageModal = false;
        this.selectedCommission = null;
    }
}
