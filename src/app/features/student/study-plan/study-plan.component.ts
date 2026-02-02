import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { TableColumn } from '@shared/interfaces/table.interface';

import { CorrelativesModalComponent } from '@shared/components/correlatives-modal/correlatives-modal.component';

@Component({
    selector: 'app-study-plan',
    standalone: true,
    imports: [CommonModule, TableComponent, PageLayoutComponent, CorrelativesModalComponent],
    template: `
        <app-page-layout 
            title="Plan de Estudios" 
            subtitle="Listado completo de materias y su estado de aprobación.">
            
            <app-table 
                [data]="displayData" 
                [columns]="columns" 
                [pageSize]="50"
                [isLoading]="isLoading"
                (onAction)="handleAction($event)">
            </app-table>

        </app-page-layout>

        @if (showModal) {
            <app-correlatives-modal
                [subjectName]="selectedSubjectName"
                [correlatives]="selectedCorrelatives"
                (close)="closeModal()">
            </app-correlatives-modal>
        }
    `,
    styles: [`
        /* No specific styles needed as we use Tailwind util classes via cellClass */
    `]
})
export class StudyPlanComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);

    displayData: any[] = [];
    isLoading: boolean = false;

    // Modal state
    showModal: boolean = false;
    selectedSubjectName: string = '';
    selectedCorrelatives: any[] = [];

    columns: TableColumn[] = [
        { key: 'nivel', label: 'Nivel', sortable: true },
        { key: 'cuatrimestre', label: 'Cuat.', sortable: true },
        { key: 'nombre', label: 'Materia', sortable: true },
        {
            key: 'esElectiva',
            label: 'Electiva',
            cellClass: (row) => row.esElectiva ? 'bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded' : ''
        },
        {
            key: 'estado',
            label: 'Estado',
            sortable: true,
            // Logic for cell coloring: 
            // APROBADA -> Green
            // REGULAR -> Yellow
            cellClass: (row) => {
                if (row.estado === 'APROBADA') {
                    return 'bg-green-100 text-green-800 font-bold px-2 py-1 rounded inline-block';
                }
                if (row.estado === 'REGULAR') {
                    return 'bg-yellow-100 text-yellow-800 font-bold px-2 py-1 rounded inline-block';
                }
                return '';
            }
        },
        { key: 'nota', label: 'Nota Final', sortable: true },
        {
            key: 'correlativasDisplay',
            label: 'Correlativas',
            type: 'custom',
            align: 'center',
            width: '140px'
        }
    ];


    ngOnInit(): void {
        this.loadData();
    }

    handleAction(event: any) {
        if (event.action === 'viewCorrelatives') {
            this.selectedSubjectName = event.row.nombre;
            this.selectedCorrelatives = event.row.correlativasList || [];
            this.showModal = true;
        }
    }

    closeModal() {
        this.showModal = false;
        this.selectedSubjectName = '';
        this.selectedCorrelatives = [];
    }

    loadData() {
        this.isLoading = true;
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                this.processData(data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading study plan:', err);
                this.isLoading = false;
            }
        });
    }

    processData(data: any[]) {
        const processed: any[] = [];

        data.forEach(carrera => {
            if (carrera.materias) {
                carrera.materias.forEach((materia: any) => {
                    // Include ALL subjects (Pending, Approved, Regular...)
                    processed.push({
                        ...materia,
                        // Format cuatrimestre: If not ANUAL, show CUATRIMESTRAL
                        cuatrimestre: materia.cuatrimestre === 'ANUAL' ? 'ANUAL' : 'CUATRIMESTRAL',
                        // Clean electiva visual
                        esElectiva: materia.esElectiva ? 'SÍ' : '',
                        // Correlativas: format as array of objects with name and condition badge
                        correlativasList: (materia.correlativas || []).map((corr: any) => ({
                            nombre: corr.nombre,
                            condicion: corr.condicion,
                            badge: corr.condicion === 'PROMOCIONADA' ? 'P' : 'R'
                        })),
                        // Display field for correlativas column
                        correlativasDisplay: {
                            hasCorrelatives: materia.correlativas && materia.correlativas.length > 0,
                            count: (materia.correlativas || []).length
                        }
                    });
                });
            }
        });

        // Optional: Sort by year/level if available, or name
        this.displayData = processed;
    }
}
