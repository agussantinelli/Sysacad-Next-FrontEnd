import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { AuthService } from '@core/services/auth.service';
import { TableColumn } from '@shared/interfaces/table.interface';
import { InscripcionCursadoResponse } from '@core/models/inscripcion-cursado.models';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-current-enrollments',
    standalone: true,
    imports: [CommonModule, TableComponent, PageLayoutComponent],
    templateUrl: './current-enrollments.component.html'
})
export class CurrentEnrollmentsComponent implements OnInit {
    private inscripcionService = inject(InscripcionCursadoService);
    private authService = inject(AuthService);

    displayData: any[] = [];
    isLoading: boolean = false;

    columns: TableColumn[] = [
        { key: 'nombreMateria', label: 'Materia', sortable: true },
        { key: 'nombreComision', label: 'Comisión', sortable: true },
        { key: 'anioCursado', label: 'Año', sortable: true },
        { key: 'estado', label: 'Estado', sortable: true },
        {
            key: 'calificacionesList',
            label: 'Calificaciones',
            type: 'list',
            width: '250px'
        }
    ];

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (user && user.id) {
                this.inscripcionService.obtenerCursadasActuales(user.id).subscribe({
                    next: (data) => {
                        this.processData(data);
                        this.isLoading = false;
                    },
                    error: (err) => {
                        console.error('Error loading current enrollments:', err);
                        this.isLoading = false;
                    }
                });
            } else {
                console.error('User not identified');
                this.isLoading = false;
            }
        });
    }

    processData(data: InscripcionCursadoResponse[]) {
        this.displayData = data.map(item => ({
            ...item,
            // Transform grading objects to simple strings for the list view
            calificacionesList: item.calificaciones?.map(c => `${c.descripcion}: ${c.nota}`) || []
        }));
    }
}
