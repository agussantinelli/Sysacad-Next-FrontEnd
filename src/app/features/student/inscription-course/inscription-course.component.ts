import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { CarreraMateriasDTO, EstudianteMateriaDTO } from '@core/models/matriculacion.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';

@Component({
    selector: 'app-inscription-course',
    standalone: true,
    imports: [CommonModule, TableComponent, FormsModule],
    templateUrl: './inscription-course.component.html',
    styleUrl: './styles/inscription-course.component.css'
})
export class InscriptionCourseComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private location = inject(Location);

    originalCarreras: CarreraMateriasDTO[] = [];
    carreras: CarreraMateriasDTO[] = [];

    // Filters
    filterNombre: string = '';
    filterEstado: string = '';
    filterTipo: string = '';
    filterNivel: string = '';

    uniqueNombres: string[] = [];
    estados: string[] = ['PENDIENTE', 'CURSANDO', 'REGULAR', 'APROBADA', 'LIBRE'];
    tipos: string[] = ['Obligatoria', 'Electiva'];
    niveles: number[] = [];

    columns: TableColumn[] = [
        { key: 'nombre', label: 'Materia', sortable: true },
    ];

    simpleColumns: TableColumn[] = [
        { key: 'nivel', label: 'Nivel', sortable: true },
        { key: 'nombre', label: 'Materia', sortable: true },
        { key: 'tipo', label: 'Tipo', sortable: true },
        { key: 'estado', label: 'Estado', sortable: true },
        { key: 'nota', label: 'Nota', sortable: true }
    ];

    actions: TableAction[] = [
        {
            name: 'inscribirse',
            label: 'Inscribirse',
            class: 'btn-inscription',
            isVisible: (row: any) => row.sePuedeInscribir === true
        }
    ];

    ngOnInit(): void {
        this.loadMaterias();
    }

    loadMaterias() {
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                console.log('✅ [InscriptionCourse] Data received:', data);
                // Map esElectiva to display string
                data.forEach(carrera => {
                    carrera.materias.forEach((materia: any) => {
                        materia.tipo = materia.esElectiva ? 'Electiva' : 'Obligatoria';
                    });
                });

                this.originalCarreras = JSON.parse(JSON.stringify(data)); // Deep copy to preserve original structure
                this.carreras = data;
                this.extractUniqueNombres();
                this.extractUniqueNiveles();
                console.log('✅ [InscriptionCourse] this.carreras set to:', this.carreras);
            },
            error: (err) => {
                console.error('❌ [InscriptionCourse] Error loading materias:', err);
            }
        });
    }

    extractUniqueNombres() {
        const nombres = new Set<string>();
        this.originalCarreras.forEach(carrera => {
            carrera.materias.forEach(materia => nombres.add(materia.nombre));
        });
        this.uniqueNombres = Array.from(nombres).sort();
    }

    extractUniqueNiveles() {
        const nivelesSet = new Set<number>();
        this.originalCarreras.forEach(carrera => {
            carrera.materias.forEach(materia => nivelesSet.add(materia.nivel));
        });
        this.niveles = Array.from(nivelesSet).sort((a, b) => a - b);
    }

    onMateriaChange() {
        if (this.filterNombre) {
            this.filterNivel = '';
            this.filterTipo = '';
            this.filterEstado = '';
        }
        this.applyFilters();
    }

    clearFilters() {
        this.filterNombre = '';
        this.filterNivel = '';
        this.filterTipo = '';
        this.filterEstado = '';
        this.applyFilters();
    }

    applyFilters() {
        // Start from original data
        const tempCarreras = JSON.parse(JSON.stringify(this.originalCarreras));

        this.carreras = tempCarreras.map((carrera: CarreraMateriasDTO) => {
            // Filter materias within each carrera
            carrera.materias = carrera.materias.filter((materia: any) => {
                const matchesNombre = this.filterNombre ? materia.nombre === this.filterNombre : true;

                // If filtering by name, ignore other filters (as they are disabled/cleared)
                if (this.filterNombre) {
                    return matchesNombre;
                }

                const matchesEstado = this.filterEstado ? materia.estado === this.filterEstado : true;
                const matchesTipo = this.filterTipo ? materia.tipo === this.filterTipo : true;
                const matchesNivel = this.filterNivel ? materia.nivel.toString() === this.filterNivel : true;
                return matchesEstado && matchesTipo && matchesNivel;
            });
            return carrera;
        }).filter((carrera: CarreraMateriasDTO) => carrera.materias.length > 0); // Only show carreras with matching materias
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
