import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlumnoExamenDTO, CargaNotaItemDTO } from '@core/models/professor.models';

@Component({
    selector: 'app-professor-grade-exam',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent],
    templateUrl: './professor-grade-exam.component.html',
    styleUrl: './styles/professor-grade-exam.component.css'
})
export class ProfessorGradeExamComponent implements OnInit {
    private professorService = inject(ProfessorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    inscriptos: AlumnoExamenDTO[] = [];
    isLoading = false;
    isSaving = false;
    error: string | null = null;
    successMessage: string | null = null;

    idMesa: string = '';
    nroDetalle: number = 0;
    materiaNombre: string = 'Carga de Notas';

    isReadOnly: boolean = false;

    ngOnInit(): void {
        this.idMesa = this.route.snapshot.paramMap.get('idMesa') || '';
        const nroDetalleStr = this.route.snapshot.paramMap.get('nroDetalle');
        this.nroDetalle = nroDetalleStr ? parseInt(nroDetalleStr, 10) : 0;

        // Get context from router state
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
            this.materiaNombre = navigation.extras.state['materiaNombre'] || this.materiaNombre;
            this.isReadOnly = !!navigation.extras.state['readOnly'];
        } else {
            const state = history.state;
            if (state && state.materiaNombre) {
                this.materiaNombre = state.materiaNombre;
                this.isReadOnly = !!state.readOnly;
            }
        }

        if (this.idMesa && this.nroDetalle > 0) {
            this.loadInscriptos();
        } else {
            this.error = 'Parámetros de examen inválidos.';
        }
    }

    loadInscriptos(): void {
        this.isLoading = true;
        this.professorService.getInscriptosExamen(this.idMesa, this.nroDetalle).subscribe({
            next: (data) => {
                // Initialize default values if needed
                this.inscriptos = data.map(alumno => ({
                    ...alumno,
                    estado: alumno.estado || 'PENDIENTE',
                    nota: alumno.nota || null
                }));
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading inscriptos', err);
                this.error = 'No se pudieron cargar los alumnos inscriptos.';
                this.isLoading = false;
            }
        });
    }

    validateGrades(): boolean {
        for (const alumno of this.inscriptos) {
            if (alumno.estado === 'APROBADO') {
                if (alumno.nota === null || alumno.nota < 6 || alumno.nota > 10) {
                    this.error = `El alumno ${alumno.apellido} está APROBADO pero tiene una nota inválida (debe ser entre 6 y 10).`;
                    return false;
                }
            } else if (alumno.estado === 'DESAPROBADO') {
                if (alumno.nota !== null && (alumno.nota < 1 || alumno.nota >= 6)) {
                    // Note definition: usually 1-5 is fail, 6-10 pass. 
                    // Asking user to correct invalid grades.
                    this.error = `El alumno ${alumno.apellido} está DESAPROBADO, la nota debe ser menor a 6.`;
                    return false;
                }
            }
        }
        return true;
    }

    canSave(): boolean {
        // Only allow saving if at least one student has a modified state/grade that isn't PENDING?
        // Or just allow saving whatever state is there.
        // For now, simple check:
        return this.inscriptos.length > 0;
    }

    saveGrades(): void {
        if (!this.validateGrades()) {
            return;
        }

        this.isSaving = true;
        this.error = null;

        const notasParaGuardar: CargaNotaItemDTO[] = this.inscriptos.map(alumno => ({
            idInscripcion: alumno.idInscripcion,
            nota: alumno.nota,
            estado: alumno.estado === 'PENDIENTE' ? 'AUSENTE' : alumno.estado as 'APROBADO' | 'DESAPROBADO' | 'AUSENTE', // Default pending to absent or handle specifically? 
            // Better to only send if status is NOT pending, or map pending to absent?
            // Spec says: estado: APROBADO, DESAPROBADO, AUSENTE. PENDIENTE is display only.
            // If user leaves as PENDIENTE, we treat as AUSENTE or don't send? 
            // Let's assume PENDIENTE -> AUSENTE for now or ask user. 
            // Actually, let's map PENDIENTE to AUSENTE if user saves, or maybe filter them out?
            // "Carga masiva" implies sending all. Let's map PENDIENTE -> AUSENTE to be safe.
        }));

        this.professorService.cargarNotasExamen(notasParaGuardar).subscribe({
            next: () => {
                this.isSaving = false;
                this.successMessage = 'Notas guardadas exitosamente.';
                setTimeout(() => {
                    this.router.navigate(['/professor/exams', this.idMesa]);
                }, 2000);
            },
            error: (err) => {
                console.error('Error saving grades', err);
                this.error = 'Ocurrió un error al guardar las notas. Intente nuevamente.';
                this.isSaving = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/professor/exams', this.idMesa]);
    }
}
