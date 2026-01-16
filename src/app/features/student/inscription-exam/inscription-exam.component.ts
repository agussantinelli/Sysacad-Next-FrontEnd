import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionService } from '@core/services/inscripcion.service';
import { AuthService } from '@core/services/auth.service';
import { CarreraMateriasDTO } from '@core/models/matriculacion.models';
import { InscripcionRequest, TipoInscripcion } from '@core/models/inscripcion.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-inscription-exam',
    standalone: true,
    imports: [CommonModule, TableComponent, FormsModule],
    templateUrl: './inscription-exam.component.html',
    styleUrl: './styles/inscription-exam.component.css'
})
export class InscriptionExamComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private inscripcionService = inject(InscripcionService);
    private authService = inject(AuthService);
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
            label: 'Inscribirse a Examen',
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
                console.log('✅ [InscriptionExam] Data received:', data);

                data.forEach(carrera => {
                    carrera.materias.forEach((materia: any) => {
                        materia.tipo = materia.esElectiva ? 'Electiva' : 'Obligatoria';

                        // Exam Inscription Validation Logic
                        // Rule 1: Allow if status is REGULAR
                        // Rule 2: Allow if subject is English I or English II (even if not Regular, for Free Exam)
                        // Rule 3: Do not allow if already APROBADA (assumed rule for common sense)

                        const esIngles = ['Inglés I', 'Inglés II'].includes(materia.nombre);
                        const esRegular = materia.estado === 'REGULAR';
                        const estaAprobada = materia.estado === 'APROBADA';

                        if (estaAprobada) {
                            materia.sePuedeInscribir = false;
                        } else if (esRegular || esIngles) {
                            materia.sePuedeInscribir = true;
                        } else {
                            materia.sePuedeInscribir = false;
                        }
                    });
                });

                this.originalCarreras = JSON.parse(JSON.stringify(data));
                this.carreras = data;
                this.extractUniqueNombres();
                this.extractUniqueNiveles();
            },
            error: (err) => {
                console.error('❌ [InscriptionExam] Error loading materias:', err);
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
        const tempCarreras = JSON.parse(JSON.stringify(this.originalCarreras));

        this.carreras = tempCarreras.map((carrera: CarreraMateriasDTO) => {
            carrera.materias = carrera.materias.filter((materia: any) => {
                const matchesNombre = this.filterNombre ? materia.nombre === this.filterNombre : true;

                if (this.filterNombre) {
                    return matchesNombre;
                }

                const matchesEstado = this.filterEstado ? materia.estado === this.filterEstado : true;
                const matchesTipo = this.filterTipo ? materia.tipo === this.filterTipo : true;
                const matchesNivel = this.filterNivel ? materia.nivel.toString() === this.filterNivel : true;
                return matchesEstado && matchesTipo && matchesNivel;
            });
            return carrera;
        }).filter((carrera: CarreraMateriasDTO) => carrera.materias.length > 0);
    }

    handleAction(event: ActionEvent<any>) {
        if (event.action === 'inscribirse') {

            this.authService.currentUser$.pipe(take(1)).subscribe(user => {
                if (!user) {
                    alert('Error: Usuario no identificado');
                    return;
                }

                const request: InscripcionRequest = {
                    idUsuario: user.id,
                    idComision: event.row.idMateria, // Mapping idMateria
                    tipo: TipoInscripcion.EXAMEN
                };

                // Confirm dialog
                if (!confirm(`¿Desea inscribirse al examen de ${event.row.nombre}?`)) return;

                this.inscripcionService.inscribirAlumno(request).subscribe({
                    next: (res) => {
                        console.log('Inscripción a examen exitosa:', res);
                        alert(`Inscripción exitosa al examen de ${event.row.nombre}`);
                        this.loadMaterias();
                    },
                    error: (err) => {
                        console.error('Error al inscribirse al examen:', err);
                        alert('Error al procesar la inscripción al examen');
                    }
                });
            });
        }
    }

    goBack(): void {
        this.location.back();
    }
}
