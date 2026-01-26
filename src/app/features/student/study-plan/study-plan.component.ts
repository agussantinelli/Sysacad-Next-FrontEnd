import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { TableColumn } from '@shared/interfaces/table.interface';

@Component({
    selector: 'app-study-plan',
    standalone: true,
    imports: [CommonModule, TableComponent, PageLayoutComponent],
    template: `
        <app-page-layout 
            title="Plan de Estudios" 
            subtitle="Listado completo de materias y su estado de aprobación.">
            
            <app-table 
                [data]="displayData" 
                [columns]="columns" 
                [pageSize]="20">
            </app-table>

        </app-page-layout>
    `,
    styles: [`
        /* No specific styles needed as we use Tailwind util classes via cellClass */
    `]
})
export class StudyPlanComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);

    displayData: any[] = [];

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
            key: 'correlativasList',
            label: 'Correlativas',
            type: 'list' // New type
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
    ];

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                this.processData(data);
            },
            error: (err) => console.error('Error loading study plan:', err)
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
                        // Correlativas as array for list view
                        correlativasList: materia.correlativas || []
                    });
                });
            }
        });

        // Optional: Sort by year/level if available, or name
        this.displayData = processed;
    }
}
