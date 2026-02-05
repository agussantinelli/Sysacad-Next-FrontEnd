import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { FacultadResponse } from '@core/models/facultad.models';
import { CarreraResponse } from '@core/models/carrera.models';
import { PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';
import { UsuarioResponse } from '@core/models/usuario.models';
import { MatriculacionRequest } from '@core/models/admin.models';
import { RolUsuario } from '@core/enums/usuario.enums';

@Component({
    selector: 'app-enroll-student',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent],
    templateUrl: './enroll-student.component.html',
    styleUrl: './styles/enroll-student.component.css'
})
export class EnrollStudentComponent implements OnInit {
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
    facultades: FacultadResponse[] = [];
    carreras: CarreraResponse[] = [];
    planes: PlanDeEstudioResponse[] = [];

    // Form Selection
    selectedFacultadId = '';
    selectedCarreraId = '';
    selectedPlanNro: number | null = null;

    ngOnInit() {
        this.loadFacultades();
    }

    loadFacultades() {
        this.isLoading = true;
        this.adminService.obtenerFacultades().subscribe({
            next: (data) => {
                this.facultades = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading faculties', err);
                this.alertService.error('Error al cargar facultades.');
                this.isLoading = false;
            }
        });
    }

    searchStudent() {
        if (!this.legajoQuery || this.legajoQuery.length < 3) {
            this.alertService.warning('Ingrese al menos 3 caracteres del legajo.');
            return;
        }

        this.isSearching = true;
        this.selectedStudent = null; // Reset selection on new search
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
        this.foundStudents = []; // Clear list after selection
        this.legajoQuery = ''; // Clear search input
    }

    onFacultadChange() {
        this.selectedCarreraId = '';
        this.carreras = [];
        this.selectedPlanNro = null;
        this.planes = [];

        if (this.selectedFacultadId) {
            this.isLoading = true;
            this.adminService.obtenerCarreras(this.selectedFacultadId).subscribe({
                next: (data) => {
                    this.carreras = data;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.alertService.error('Error al cargar carreras.');
                    this.isLoading = false;
                }
            });
        }
    }

    onCarreraChange() {
        this.selectedPlanNro = null;
        this.planes = [];

        if (this.selectedCarreraId) {
            this.isLoading = true;
            this.adminService.obtenerPlanes(this.selectedCarreraId).subscribe({
                next: (data) => {
                    this.planes = data.filter(p => p.esVigente); // Only active plans usually
                    this.isLoading = false;
                },
                error: (err) => {
                    this.alertService.error('Error al cargar planes.');
                    this.isLoading = false;
                }
            });
        }
    }

    onSubmit() {
        if (!this.selectedStudent || !this.selectedFacultadId || !this.selectedCarreraId || !this.selectedPlanNro) {
            this.alertService.error('Complete todos los campos.');
            return;
        }

        const request: MatriculacionRequest = {
            idUsuario: this.selectedStudent.id,
            idFacultad: this.selectedFacultadId,
            idCarrera: this.selectedCarreraId,
            nroPlan: this.selectedPlanNro
        };

        this.isLoading = true;
        this.adminService.matricular(request).subscribe({
            next: () => {
                this.alertService.success(`Alumno matriculado exitosamente en el plan ${this.selectedPlanNro}.`);
                this.resetForm();
                this.isLoading = false;
                // Optional: navigate somewhere or just start over
            },
            error: (err) => {
                console.error('Error matriculating', err);
                // Handle specific backend errors if needed (e.g., student already enrolled)
                this.alertService.error('Error al matricular el alumno. Verifique si ya está inscripto.');
                this.isLoading = false;
            }
        });
    }

    resetForm() {
        this.selectedStudent = null;
        this.selectedFacultadId = '';
        this.selectedCarreraId = '';
        this.selectedPlanNro = null;
        this.carreras = [];
        this.planes = [];
    }
}
