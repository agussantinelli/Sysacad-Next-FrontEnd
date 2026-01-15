import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { MateriaService } from '@core/services/materia.service';
import { MateriaResponse } from '@core/models/materia.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';

@Component({
    selector: 'app-inscription',
    standalone: true,
    imports: [CommonModule, TableComponent],
    templateUrl: './inscription.component.html',
    styleUrl: './styles/inscription.component.css'
})
export class InscriptionComponent implements OnInit {
    private materiaService = inject(MateriaService);
    private location = inject(Location);

    materias: MateriaResponse[] = [];
    columns: TableColumn[] = [
        { key: 'nombre', label: 'Materia', sortable: true },
        { key: 'tipoMateria', label: 'Tipo', sortable: true },
        { key: 'duracion', label: 'Duración', sortable: true },
        { key: 'modalidad', label: 'Modalidad', sortable: true },
        { key: 'cuatrimestreDictado', label: 'Cuatrimestre', sortable: true }
    ];

    actions: TableAction[] = [
        { name: 'inscribirse', label: 'Inscribirse', class: 'btn-inscription' }
    ];

    ngOnInit(): void {
        this.loadMaterias();
    }

    loadMaterias() {
        this.materiaService.listarTodas().subscribe({
            next: (data) => this.materias = data,
            error: (err) => console.error('Error loading materias', err)
        });
    }

    handleAction(event: ActionEvent<MateriaResponse>) {
        if (event.action === 'inscribirse') {
            console.log('Inscribirse a:', event.row.nombre);
            // TODO: Implement actual inscription logic
            alert(`Inscripción a ${event.row.nombre} simulada.`);
        }
    }
}
