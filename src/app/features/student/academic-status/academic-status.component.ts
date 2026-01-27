import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
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

    // Raw Data
    matriculacionData: any[] = [];

    displayData: any[] = [];
    isLoading: boolean = false;

    // Modal State
    selectedMateria: any = null;
    isModalOpen = false;
    historyData: any = null;
    isLoadingHistory = false;

    // Modal State

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
        this.isLoading = true;
        // We only need basic subject info to list them. History is loaded on demand.
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                console.log('✅ [Academic Status] Carreras loaded:', data);
                this.matriculacionData = data;
                this.processData();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ [Academic Status] Error loading carreras:', err);
                this.isLoading = false;
            }
        });
    }

    processData() {
        const processed: any[] = [];

        this.matriculacionData.forEach(carrera => {
            carrera.materias.forEach((materia: any) => {
                if (materia.estado === 'PENDIENTE') {
                    return;
                }
                // No history pre-calculation
                processed.push(materia);
            });
        });

        this.displayData = processed;
    }

    handleAction(event: ActionEvent<any>) {
        if (event.action === 'ver-historial') {
            this.openHistoryModal(event.row);
        }
    }

    openHistoryModal(materia: any) {
        this.selectedMateria = materia;
        this.isModalOpen = true;
        this.isLoadingHistory = true;
        this.historyData = null; // Reset previous data

        this.matriculacionService.getHistorialMateria(materia.idMateria).subscribe({
            next: (data) => {
                console.log('📊 [Academic Status] History loaded:', data);
                this.historyData = {
                    nombre: materia.nombre, // Ensure name is passed
                    historyExams: data.finales || [], // Map fields to match modal expectation
                    historyCursadas: data.cursadas || []
                };
                this.isLoadingHistory = false;
            },
            error: (err) => {
                console.error('❌ [Academic Status] Error loading history:', err);
                this.isLoadingHistory = false;
            }
        });
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedMateria = null;
        this.historyData = null;
    }
}
