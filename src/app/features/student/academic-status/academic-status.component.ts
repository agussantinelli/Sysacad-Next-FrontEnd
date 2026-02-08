import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { AuthService } from '@core/services/auth.service';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { HistoryModalComponent } from './components/history-modal/history-modal.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-academic-status',
    standalone: true,
    imports: [CommonModule, TableComponent, HistoryModalComponent, PageLayoutComponent],
    templateUrl: './academic-status.component.html',
    styleUrls: ['./styles/academic-status.component.css']
})
export class AcademicStatusComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private authService = inject(AuthService);

    
    matriculacionData: any[] = [];
    displayData: any[] = [];
    isLoading: boolean = false;

    
    selectedMateria: any = null;
    isModalOpen = false;
    historyData: any = null;
    isLoadingHistory = false;

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
        this.historyData = null;

        let currentUser: any = null;
        this.authService.currentUser$.subscribe(u => currentUser = u).unsubscribe();

        const userId = currentUser ? currentUser.id : null;

        if (!userId) {
            console.error('❌ [Academic Status] User ID not found');
            this.isLoadingHistory = false;
            return;
        }

        const history$ = this.matriculacionService.getHistorialMateria(materia.idMateria);
        const grades$ = this.matriculacionService.getNotasCursada(userId, materia.idMateria);

        forkJoin({
            history: history$,
            grades: grades$
        }).subscribe({
            next: (data) => {
                console.log('📊 [Academic Status] History & Grades loaded:', data);
                this.historyData = {
                    nombre: materia.nombre,
                    historyExams: data.history.finales || [],
                    historyCursadas: data.history.cursadas || [],
                    historyNotas: data.grades || []
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
