import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';
import { AlumnoCursadaDTO, CargaNotasCursadaDTO, CalificacionDTO, NotaCursadaItemDTO } from '@core/models/professor.models';
import { EstadoCursada } from '@core/enums/inscripcion.enums';

interface StudentRow {
    studentId: string;
    studentName: string;
    legajo: number;
    grades: { [concepto: string]: number }; // Map concept -> grade
    newGrade: number | null;
    newState: string | null;
    prevNewGrade: number | null; // Track changes
    prevNewState: string | null;
}

@Component({
    selector: 'app-professor-grade-commission',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent, AlertMessageComponent, FormsModule],
    templateUrl: './professor-grade-commission.component.html',
    styleUrl: './styles/professor-grade-commission.component.css'
})
export class ProfessorGradeCommissionComponent implements OnInit {
    private professorService = inject(ProfessorService);
    private alertService = inject(AlertService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    idComision = '';
    idMateria = '';

    students: StudentRow[] = [];
    concepts: string[] = []; // Dynamic columns
    availableStates = Object.values(EstadoCursada);

    // Form controls
    concepto = '';
    esNotaFinal = false;

    isLoading = false;
    isSaving = false;
    error: string | null = null;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.idComision = params.get('idComision') || '';
            this.idMateria = params.get('idMateria') || '';

            if (this.idComision && this.idMateria) {
                this.loadStudents();
            } else {
                this.error = 'Información de comisión o materia no válida';
            }
        });
    }

    loadStudents(): void {
        this.isLoading = true;
        this.error = null;

        this.professorService.getInscriptosComision(this.idComision, this.idMateria).subscribe({
            next: (data: AlumnoCursadaDTO[]) => {
                // Extract all unique concepts
                const allConcepts = new Set<string>();
                data.forEach(student => {
                    student.calificaciones?.forEach(c => allConcepts.add(c.concepto));
                });
                this.concepts = Array.from(allConcepts).sort();

                // Build student rows
                this.students = data.map(a => {
                    const gradeMap: { [key: string]: number } = {};
                    a.calificaciones?.forEach(c => {
                        gradeMap[c.concepto] = c.nota;
                    });

                    // If current state is CURSANDO (or null), default 'New State' selector to CURSANDO
                    // Otherwise keep their existing finalized state
                    const defaultState = (a.estado === EstadoCursada.CURSANDO || !a.estado)
                        ? EstadoCursada.CURSANDO
                        : a.estado;

                    return {
                        studentId: a.idInscripcion,
                        studentName: `${a.nombre} ${a.apellido}`,
                        legajo: a.legajo,
                        grades: gradeMap,
                        newGrade: null,
                        newState: defaultState,
                        prevNewGrade: null,
                        prevNewState: defaultState
                    };
                });

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading students', err);
                this.error = 'Error al cargar alumnos.';
                this.isLoading = false;
            }
        });
    }

    hasChanges(): boolean {
        // Change if grade changed OR (final grade active AND state changed)
        return this.students.some(s =>
            (s.newGrade !== s.prevNewGrade) ||
            (this.esNotaFinal && s.newState !== s.prevNewState)
        );
    }

    saveGrades(): void {
        if (!this.hasChanges()) {
            this.alertService.info('No hay cambios para guardar');
            return;
        }

        // Validate Concept if NOT final grade
        if (!this.esNotaFinal && !this.concepto.trim()) {
            this.alertService.error('Debe ingresar un concepto para la nota (ej: 1er Parcial)');
            return;
        }

        // If it's a final grade, concept can be empty (defaults to 'Nota Final' or similar backend side if needed, or just sent as empty string)
        const conceptoToSend = this.esNotaFinal ? (this.concepto.trim() || 'Nota Final') : this.concepto;

        const updates: CargaNotasCursadaDTO = {
            concepto: conceptoToSend,
            esNotaFinal: this.esNotaFinal,
            notas: this.students
                .filter(s => {
                    // Logic: 
                    // 1. Grade changed AND is not null (regular grading)
                    // 2. State changed AND is Final Grade active (state update, maybe grade is null)
                    const gradeChanged = s.newGrade !== s.prevNewGrade && s.newGrade !== null;
                    const stateChanged = this.esNotaFinal && s.newState !== s.prevNewState;
                    // Note: If state changed to CURSANDO, newGrade might be null, which is now allowed by DTO.
                    return gradeChanged || stateChanged;
                })
                .map(s => {
                    // Force null grade if state is CURSANDO or LIBRE and it's a final grade note
                    if (this.esNotaFinal && (s.newState === EstadoCursada.CURSANDO || s.newState === EstadoCursada.LIBRE)) {
                        s.newGrade = null;
                    }

                    const item: NotaCursadaItemDTO = {
                        idInscripcion: s.studentId,
                        nota: s.newGrade // Can be null
                    };
                    if (this.esNotaFinal) {
                        item.estado = s.newState || undefined;
                    }
                    return item;
                })
        };

        if (updates.notas.length === 0) {
            this.alertService.info('No hay notas válidas para guardar');
            return;
        }

        this.isSaving = true;
        this.professorService.cargarNotasComision(this.idComision, this.idMateria, updates).subscribe({
            next: () => {
                this.alertService.success('Notas guardadas correctamente');
                this.isSaving = false;

                // Clear input and reload to show new column
                this.concepto = '';
                this.esNotaFinal = false;
                this.loadStudents();
            },
            error: (err) => {
                console.error('Error saving grades', err);
                this.alertService.error('Error al guardar notas');
                this.isSaving = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/professor/my-commissions']);
    }

    getGradeClass(grade: number | undefined): string {
        if (grade === undefined) return '';
        return grade >= 6 ? 'grade-passing' : 'grade-failing';
    }
}
