import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HistoryModalComponent } from './components/history-modal/history-modal.component';

@Component({
    selector: 'app-academic-status',
    standalone: true,
    imports: [CommonModule, TableComponent, HistoryModalComponent, PageLayoutComponent],
    templateUrl: './academic-status.component.html',
    styleUrls: ['./styles/academic-status.component.css']
})
export class AcademicStatusComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private inscripcionExamenService = inject(InscripcionExamenService);
    private inscripcionCursadoService = inject(InscripcionCursadoService);

    // Raw Data
    matriculacionData: any[] = [];
    examenesData: any[] = [];
    cursadasData: any[] = [];

    // Display Data
    displayData: any[] = [];

    // Modal State
    selectedMateria: any = null;
    isModalOpen = false;

    columns: TableColumn[] = [
        { key: 'nivel', label: 'Nivel', sortable: true },
        { key: 'nombre', label: 'Materia', sortable: true },
        { key: 'estado', label: 'Estado', sortable: true },
        { key: 'nota', label: 'Nota Final', sortable: true },
    ];

    actions: TableAction[] = [
        {
            name: 'ver-historial',
            label: 'Ver Historial',
            class: 'btn-primary',
            isVisible: () => true
        }
    ];

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        forkJoin({
            carreras: this.matriculacionService.getMisCarrerasMaterias().pipe(
                catchError(err => {
                    console.error('❌ [Academic Status] Error fetching carreras:', err);
                    return of([]);
                })
            ),
            examenes: this.inscripcionExamenService.misInscripciones().pipe(
                catchError(err => {
                    console.error('❌ [Academic Status] Error fetching examenes:', err);
                    return of([]);
                })
            ),
            cursadas: this.inscripcionCursadoService.misCursadas().pipe(
                catchError(err => {
                    console.error('❌ [Academic Status] Error fetching cursadas (Backend 500?):', err);
                    return of([]);
                })
            )
        }).subscribe({
            next: (res) => {
                console.log('✅ [Academic Status] Data loaded (partial or full):', res);
                this.matriculacionData = res.carreras || [];
                this.examenesData = res.examenes || [];
                this.cursadasData = res.cursadas || [];
                this.processData();
            }
        });
    }

    processData() {
        const processed: any[] = [];

        // Flatten subjects from all careers
        this.matriculacionData.forEach(carrera => {
            carrera.materias.forEach((materia: any) => {
                // Filter out 'PENDIENTE' subjects as requested
                if (materia.estado === 'PENDIENTE') {
                    return;
                }

                // Find associated history
                const historyExams = this.examenesData.filter(e => e.nombreMateria === materia.nombre);
                const historyCursadas = this.cursadasData.filter(c => c.nombreMateria === materia.nombre);

                processed.push({
                    ...materia,
                    historyExams,
                    historyCursadas
                });
            });
        });

        this.displayData = processed;
    }

    handleAction(event: ActionEvent<any>) {
        if (event.action === 'ver-historial') {
            this.selectedMateria = event.row;
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedMateria = null;
    }
}
