import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { MesaExamenService } from '@core/services/mesa-examen.service';
import { AuthService } from '@core/services/auth.service';
import { CarreraMateriasDTO } from '@core/models/carrera-materias.models';
import { InscripcionExamenRequest } from '@core/models/inscripcion-examen.models';
import { MesaExamenResponse } from '@core/models/mesa-examen.models';
import { DetalleMesaExamenResponse } from '@core/models/detalle-mesa-examen.models';
import { TableColumn, TableAction, ActionEvent } from '@shared/interfaces/table.interface';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-inscription-exam',
    standalone: true,
    imports: [CommonModule, TableComponent, FormsModule, PageLayoutComponent],
    templateUrl: './inscription-exam.component.html',
    styleUrl: './styles/inscription-exam.component.css'
})
export class InscriptionExamComponent implements OnInit {
    private matriculacionService = inject(MatriculacionService);
    private inscripcionService = inject(InscripcionExamenService);
    private mesaExamenService = inject(MesaExamenService);
    private authService = inject(AuthService);
    private location = inject(Location);

    originalCarreras: CarreraMateriasDTO[] = [];
    carreras: CarreraMateriasDTO[] = [];
    mesas: MesaExamenResponse[] = [];

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
        },
        {
            name: 'sin-fechas',
            label: 'Sin fechas',
            class: 'btn-disabled-action',
            isVisible: (row: any) => row.condicionAcademica === true && row.sePuedeInscribir === false
        }
    ];

    ngOnInit(): void {
        this.loadMaterias();
        this.loadMesas();
    }

    loadMaterias() {
        this.matriculacionService.getMisCarrerasMaterias().subscribe({
            next: (data) => {
                console.log('✅ [InscriptionExam] Data received:', data);

                data.forEach(carrera => {
                    carrera.materias.forEach((materia: any) => {
                        materia.tipo = materia.esElectiva ? 'Electiva' : 'Obligatoria';

                        // Default to false, enabled later if mesa exists
                        materia.sePuedeInscribir = false;

                        // Exam Inscription Validation Logic
                        // Rule 1: Allow if status is REGULAR
                        // Rule 2: Allow if subject is English I or English II (even if not Regular, for Free Exam)
                        // Rule 3: Do not allow if already APROBADA
                        const esIngles = ['Inglés I', 'Inglés II'].includes(materia.nombre);
                        const esRegular = materia.estado === 'REGULAR';
                        const estaAprobada = materia.estado === 'APROBADA';
                        const condicionAcademica = !estaAprobada && (esRegular || esIngles);

                        materia.condicionAcademica = condicionAcademica; // Save for logic in handleAction or mesa check
                    });
                });

                this.originalCarreras = JSON.parse(JSON.stringify(data));
                this.carreras = data;
                this.extractUniqueNombres();
                this.extractUniqueNiveles();

                // Re-evaluate inscription capability if mesas are already loaded
                if (this.mesas.length > 0) {
                    this.updateInscriptionStatus();
                }
            },
            error: (err) => {
                console.error('❌ [InscriptionExam] Error loading materias:', err);
            }
        });
    }

    loadMesas() {
        this.mesaExamenService.listarMesas().subscribe({
            next: (mesas) => {
                this.mesas = mesas;
                console.log('✅ [InscriptionExam] Mesas loaded:', mesas);
                if (this.carreras.length > 0) {
                    this.updateInscriptionStatus();
                }
            },
            error: (err) => {
                console.error('❌ [InscriptionExam] Error loading mesas:', err);
            }
        });
    }

    updateInscriptionStatus() {
        // Only allow inscription if acadamically allowed AND there is an open mesa for that subject
        const now = new Date();

        this.carreras.forEach(carrera => {
            carrera.materias.forEach((materia: any) => {
                if (materia.condicionAcademica) {
                    // Find if there is any active mesa with this subject
                    const mesaFound = this.findMesaForMateria(materia.idMateria);
                    materia.sePuedeInscribir = !!mesaFound;
                    materia.mesaDetalle = mesaFound; // Store for action
                }
            });
        });
    }

    findMesaForMateria(idMateria: string): { mesa: MesaExamenResponse, detalle: DetalleMesaExamenResponse } | null {
        for (const mesa of this.mesas) {
            // Logic check for dates could go here (e.g. is inscription open?)
            // For now assuming all listed mesas are valid candidates if they contain the subject
            const detalle = mesa.detalles.find(d => d.idMateria === idMateria);
            if (detalle) {
                return { mesa, detalle };
            }
        }
        return null;
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

            const materia = event.row;
            if (!materia.mesaDetalle) {
                alert('No se encontró una mesa de examen habilitada para esta materia.');
                return;
            }

            this.authService.currentUser$.pipe(take(1)).subscribe(user => {
                if (!user) {
                    alert('Error: Usuario no identificado');
                    return;
                }

                const infoMesa = materia.mesaDetalle as { mesa: MesaExamenResponse, detalle: DetalleMesaExamenResponse };

                const request: InscripcionExamenRequest = {
                    idUsuario: user.id,
                    idMesaExamen: infoMesa.mesa.id,
                    nroDetalle: infoMesa.detalle.nroDetalle
                };

                // Confirm dialog
                if (!confirm(`¿Desea inscribirse al examen de ${materia.nombre} para la fecha ${infoMesa.detalle.diaExamen} ${infoMesa.detalle.horaExamen}?`)) return;

                this.inscripcionService.inscribirExamen(request).subscribe({
                    next: (res) => {
                        console.log('Inscripción a examen exitosa:', res);
                        alert(`Inscripción exitosa al examen de ${materia.nombre}`);
                        this.loadMaterias(); // Re-load to update status if needed
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
