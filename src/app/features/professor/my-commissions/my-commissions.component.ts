import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { ComisionDetalladaDTO } from '@core/models/professor.models';

@Component({
    selector: 'app-my-commissions',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent],
    templateUrl: './my-commissions.component.html',
    styleUrl: './styles/my-commissions.component.css'
})
export class MyCommissionsComponent implements OnInit {
    private professorService = inject(ProfessorService);

    comisiones: ComisionDetalladaDTO[] = [];
    isLoading = false;
    error: string | null = null;

    ngOnInit(): void {
        this.loadMisComisiones();
    }

    loadMisComisiones(): void {
        this.isLoading = true;
        this.error = null;

        this.professorService.getMisComisiones().subscribe({
            next: (data) => {
                this.comisiones = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading commissions', err);
                this.error = 'No se pudieron cargar las comisiones. Intente nuevamente.';
                this.isLoading = false;
            }
        });
    }
}
