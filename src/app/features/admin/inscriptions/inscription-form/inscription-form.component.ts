import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { UsuarioService } from '@core/services/usuario.service';
import { UsuarioResponse } from '@core/models/usuario.models';

@Component({
    selector: 'app-inscription-form',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './inscription-form.component.html',
    styleUrl: './styles/inscription-form.component.css'
})
export class InscriptionFormComponent implements OnInit {
    private adminService = inject(AdminService);
    private usuarioService = inject(UsuarioService);
    private alertService = inject(AlertService);
    private router = inject(Router);

    isLoading = false;
    students: UsuarioResponse[] = [];

    // Form Model
    inscriptionData = {
        idAlumno: '',
        tipo: 'CURSADA', // 'CURSADA' | 'EXAMEN'
        idMateria: '', // We need subjects list
        idComision: '', // If cursada
        idMesa: '' // If examen
    };

    ngOnInit() {
        this.loadStudents();
        // We also need to load subjects, commissions, exams. 
        // For now, let's just get the component rendering.
    }

    loadStudents() {
        // Ideally we should have a 'getStudents' endpoint or search. 
        // Reusing obtenerTodos for now, though it might be heavy.
        this.isLoading = true;
        this.usuarioService.obtenerTodos().subscribe({
            next: (data) => {
                this.students = data.filter(u => u.rol === 'ESTUDIANTE');
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading students', err);
                this.isLoading = false;
            }
        });
    }

    onSubmit() {
        console.log('Submit', this.inscriptionData);
        // Helper to validate and call service
        this.createInscription();
    }

    createInscription() {
        this.isLoading = true;
        // Mock call for now until service is updated
        /*
        this.adminService.crearInscripcion(this.inscriptionData).subscribe({
            next: () => {
                this.alertService.success('Inscripción creada exitosamente.');
                this.router.navigate(['/admin/inscriptions']);
            },
            error: (err) => {
                this.alertService.error('Error al crear inscripción.');
                this.isLoading = false;
            }
        });
        */
        setTimeout(() => {
            this.alertService.success('Funcionalidad en construcción. Datos: ' + JSON.stringify(this.inscriptionData));
            this.isLoading = false;
            this.router.navigate(['/admin/inscriptions']);
        }, 1000);
    }

    cancel() {
        this.router.navigate(['/admin/inscriptions']);
    }
}
