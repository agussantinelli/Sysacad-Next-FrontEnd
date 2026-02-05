import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { UsuarioService } from '@core/services/usuario.service';
import { UsuarioResponse } from '@core/models/usuario.models';
import { RolUsuario } from '@core/enums/usuario.enums';
import { ComisionDisponibleDTO } from '@core/models/comision-disponible.models';
import { MesaExamenDisponibleDTO } from '@core/models/mesa-examen-disponible.models';
import { MateriaResponse } from '@core/models/materia.models';
import { AdminInscripcionRequest } from '@core/models/admin.models';

@Component({
    selector: 'app-inscription-form',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent],
    templateUrl: './inscription-form.component.html',
    styleUrl: './styles/inscription-form.component.css'
})
export class InscriptionFormComponent implements OnInit {
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);
    private router = inject(Router);

    isLoading = false;

    // Search
    legajoQuery = '';
    foundStudents: UsuarioResponse[] = [];
    selectedStudent: UsuarioResponse | null = null;
    isSearching = false;

    // Selection Data
    materias: MateriaResponse[] = [];
    comisiones: ComisionDisponibleDTO[] = [];
    mesas: MesaExamenDisponibleDTO[] = [];

    // Form Selection
    tipo: 'CURSADA' | 'EXAMEN' | null = null;
    selectedMateriaId = '';
    selectedComisionId = '';
    selectedMesaDetalleId = '';
    selectedMesaNroDetalle: number | null = null;

    ngOnInit() {
        // No initial load needed, starts with search
    }

    // Reuse search logic (could be shared service/component)
    searchStudent() {
        if (!this.legajoQuery || this.legajoQuery.length < 3) {
            this.alertService.warning('Ingrese al menos 3 caracteres del legajo.');
            return;
        }

        this.isSearching = true;
        this.selectedStudent = null;
        this.adminService.buscarUsuarios(this.legajoQuery).subscribe({
            next: (data) => {
                // Filter only students
                this.foundStudents = data.filter(user => user.rol === RolUsuario.ESTUDIANTE);

                this.isSearching = false;
                if (this.foundStudents.length === 0) {
                    this.alertService.info('No se encontraron alumnos con ese legajo.');
                }
            },
            error: (err) => {
                console.error('Error searching students', err);
                this.alertService.error('Error al buscar alumnos.');
                this.isSearching = false;
            }
        });
    }

    selectStudent(student: UsuarioResponse) {
        this.selectedStudent = student;
        this.foundStudents = [];
        this.legajoQuery = '';
        this.resetSelections();
    }

    resetSelections() {
        this.selectedMateriaId = '';
        this.selectedComisionId = '';
        this.selectedMesaDetalleId = '';
        this.selectedMesaNroDetalle = null;
        this.materias = [];
        this.comisiones = [];
        this.mesas = [];
        if (this.selectedStudent && this.tipo) {
            this.loadMaterias();
        }
    }

    onTipoChange() {
        this.resetSelections();
    }

    loadMaterias() {
        console.log('loadMaterias triggered', { student: this.selectedStudent, tipo: this.tipo });
        if (!this.selectedStudent || !this.tipo) {
            console.log('Missing student or tipo, aborting load');
            return;
        }
        this.isLoading = true;

        const request = this.tipo === 'CURSADA'
            ? this.adminService.getMateriasCursada(this.selectedStudent.id)
            : this.adminService.getMateriasExamen(this.selectedStudent.id);

        request.subscribe({
            next: (data) => {
                console.log('Materias loaded:', data);
                this.materias = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.alertService.error('Error al cargar materias.');
                this.isLoading = false;
            }
        });
    }

    onMateriaChange() {
        this.selectedComisionId = '';
        this.selectedMesaDetalleId = '';
        this.comisiones = [];
        this.mesas = [];

        if (this.selectedMateriaId && this.selectedStudent) {
            this.isLoading = true;
            if (this.tipo === 'CURSADA') {
                this.adminService.getComisiones(this.selectedStudent.id, this.selectedMateriaId).subscribe({
                    next: (data) => {
                        console.log('Comisiones loaded:', data);
                        this.comisiones = data;
                        this.isLoading = false;
                    },
                    error: (err) => {
                        this.alertService.error('Error al cargar comisiones.');
                        this.isLoading = false;
                    }
                });
            } else {
                this.adminService.getMesas(this.selectedStudent.id, this.selectedMateriaId).subscribe({
                    next: (data) => {
                        this.mesas = data;
                        this.isLoading = false;
                    },
                    error: (err) => {
                        this.alertService.error('Error al cargar mesas.');
                        this.isLoading = false;
                    }
                });
            }
        }
    }

    // For exams, when selecting a mesa, we need to capture nroDetalle too
    onMesaChange() {
        const selectedMesa = this.mesas.find(m => m.idDetalleMesa === this.selectedMesaDetalleId);
        if (selectedMesa) {
            this.selectedMesaNroDetalle = selectedMesa.nroDetalle;
        }
    }

    onSubmit() {
        if (!this.selectedStudent || !this.tipo) return;

        const request: AdminInscripcionRequest = {
            idAlumno: this.selectedStudent.id,
            tipo: this.tipo,
            idMateria: this.selectedMateriaId,
            idReferencia: this.tipo === 'CURSADA' ? this.selectedComisionId : this.selectedMesaDetalleId
        };

        if (this.tipo === 'EXAMEN') {
            if (this.selectedMesaNroDetalle !== null) {
                request.nroDetalle = this.selectedMesaNroDetalle;
            } else {
                this.alertService.error('Error al seleccionar la mesa.');
                return;
            }
        }

        this.isLoading = true;
        this.adminService.inscribir(request).subscribe({
            next: () => {
                this.alertService.success('Inscripción creada exitosamente.');
                this.router.navigate(['/admin/inscriptions']);
            },
            error: (err) => {
                console.error('Error creating inscription', err);
                this.alertService.error(err.response?.data?.message || 'Error al crear inscripción.');
                this.isLoading = false;
            }
        });
    }

    cancel() {
        this.router.navigate(['/admin/inscriptions']);
    }
}
