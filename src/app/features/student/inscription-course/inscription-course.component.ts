import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { CarreraMateriasDTO } from '@core/models/matriculacion.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';

@Component({
    selector: 'app-inscription',
    standalone: true,
    imports: [CommonModule, TableComponent],
    templateUrl: './inscription.component.html',
    styleUrl: './styles/inscription.component.css'
})
export class InscriptionComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private location = inject(Location);

    carreras: CarreraMateriasDTO[] = [];
    columns: TableColumn[] = [
        { key: 'nombre', label: 'Materia', sortable: true },
        // These fields might not be in SimpleMateriaDTO (id, nombre). 
        // Need to check if endpoint returns extended data or just SimpleMateriaDTO. 
        // User prompt said "materias: [{id, nombre} ...]" (SimpleMateriaDTO).
        // If so, columns like duration/modalidad won't be available unless the endpoint returns them.
        // Assuming for now the user wants to see what's available. 
        // If query only returns ID and Name, I can only show that.
        // Waiting for verification or assuming I need to adjust columns.
        // Given the prompt: "Devuelve una lista de objetos SimpleMateriaDTO" inside "materias".
        // SimpleMateriaDTO typically only has ID and Name.
        // I should probably simplify columns or ask backend to send more info.
        // For now, I'll allow Name and ID (implicitly).
    ];

    // ADJUSTING COLUMNS FOR SimpleMateriaDTO
    simpleColumns: TableColumn[] = [
        { key: 'nombre', label: 'Materia', sortable: true }
    ];

    actions: TableAction[] = [
        { name: 'inscribirse', label: 'Inscribirse', class: 'btn-inscription' }
    ];

    ngOnInit(): void {
        this.loadMaterias();
    }

    loadMaterias() {
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => this.carreras = data,
            error: (err) => console.error('Error loading materias', err)
        });
    }

    handleAction(event: ActionEvent<any>) {
        if (event.action === 'inscribirse') {
            console.log('Inscribirse a:', event.row.nombre);
            alert(`Inscripción a ${event.row.nombre} simulada.`);
        }
    }

    goBack(): void {
        this.location.back();
    }
}
