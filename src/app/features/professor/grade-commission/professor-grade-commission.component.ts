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
    grades: { [concepto: string]: number }; 
    finalGrade: number | null; 
    originalState: string | null; 
    newGrade: number | null;
    newState: string | null;
    prevNewGrade: number | null; 
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
    concepts: string[] = []; 
    availableStates = Object.values(EstadoCursada);
    public readonly EstadoCursada = EstadoCursada;
    showFinalGradeColumn = false;

    
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
                
                const allConcepts = new Set<string>();
                data.forEach(student => {
                    student.calificaciones?.forEach(c => allConcepts.add(c.concepto));
                });
                this.concepts = Array.from(allConcepts).sort();

                
                this.students = data.map(a => {
                    const gradeMap: { [key: string]: number } = {};
                    a.calificaciones?.forEach(c => {
                        gradeMap[c.concepto] = c.nota;
                    });

                    
                    
                    const defaultState = (a.estado === EstadoCursada.CURSANDO || !a.estado)
                        ? EstadoCursada.CURSANDO
                        : a.estado;

                    return {
                        studentId: a.idInscripcion,
                        studentName: `${a.nombre} ${a.apellido}`,
                        legajo: a.legajo,
                        grades: gradeMap,
                        finalGrade: a.notaFinal || null,
                        originalState: a.estado || null,
                        newGrade: null,
                        newState: defaultState,
                        prevNewGrade: null,
                        prevNewState: defaultState
                    };
                });

                
                this.showFinalGradeColumn = this.students.some(s => s.finalGrade !== null && s.finalGrade !== undefined);

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

        
        if (!this.esNotaFinal && !this.concepto.trim()) {
            this.alertService.error('Debe ingresar un concepto para la nota (ej: 1er Parcial)');
            return;
        }

        
        const conceptoToSend = this.esNotaFinal ? (this.concepto.trim() || 'Nota Final') : this.concepto;

        const updates: CargaNotasCursadaDTO = {
            concepto: conceptoToSend,
            esNotaFinal: this.esNotaFinal,
            notas: this.students
                .filter(s => {
                    
                    
                    
                    const gradeChanged = s.newGrade !== s.prevNewGrade && s.newGrade !== null;
                    const stateChanged = this.esNotaFinal && s.newState !== s.prevNewState;
                    
                    return gradeChanged || stateChanged;
                })
                .map(s => {
                    
                    if (this.esNotaFinal && (s.newState === EstadoCursada.CURSANDO || s.newState === EstadoCursada.LIBRE)) {
                        s.newGrade = null;
                    }

                    const item: NotaCursadaItemDTO = {
                        idInscripcion: s.studentId,
                        nota: s.newGrade 
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
