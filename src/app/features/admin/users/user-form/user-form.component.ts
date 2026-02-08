import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AlertService } from '@core/services/alert.service';
import { UsuarioRequest, EstadoUsuario } from '@core/models/usuario.models';
import { RolUsuario, TipoDocumento, Genero } from '@core/enums/usuario.enums';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, FormsModule, PageLayoutComponent],
    templateUrl: './user-form.component.html',
    styleUrl: './styles/user-form.component.css'
})
export class UserFormComponent implements OnInit {
    private usuarioService = inject(UsuarioService);
    private alertService = inject(AlertService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    isEditMode = false;
    userId: string | null = null;
    isLoading = false;

    
    roles = Object.values(RolUsuario);
    tiposDocumento = Object.values(TipoDocumento);

    usuario: UsuarioRequest = {
        dni: '',
        nombre: '',
        apellido: '',
        mail: '',
        tipoDocumento: TipoDocumento.DNI,
        rol: RolUsuario.ESTUDIANTE,
        estado: EstadoUsuario.ACTIVO,
        
        fechaNacimiento: new Date().toISOString().split('T')[0], 
        fechaIngreso: new Date().toISOString().split('T')[0],
        genero: Genero.M,
        telefono: '',
        direccion: '',
        ciudad: '',
        legajo: ''
    };

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id');
        if (this.userId) {
            this.isEditMode = true;
            this.loadUser(this.userId);
        }
    }

    loadUser(id: string) {
        this.isLoading = true;
        this.usuarioService.obtenerPorId(id).subscribe({
            next: (data) => {
                this.usuario = {
                    ...data,
                    
                    legajo: data.legajo || '',
                    telefono: data.telefono || '',
                    direccion: data.direccion || '',
                    
                    password: ''
                };
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading user:', err);
                this.alertService.error('Error al cargar datos del usuario.');
                this.router.navigate(['/admin/users']);
            }
        });
    }

    onSubmit() {
        this.isLoading = true;

        if (this.isEditMode && this.userId) {
            this.usuarioService.actualizarUsuario(this.userId, this.usuario).subscribe({
                next: () => {
                    this.alertService.success('Usuario actualizado correctamente.');
                    this.router.navigate(['/admin/users']);
                },
                error: (err: any) => {
                    console.error('Error updating user:', err);
                    const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar usuario.';
                    this.alertService.error(errorMessage);
                    this.isLoading = false;
                }
            });
        } else {
            
            this.usuarioService.crearUsuario(this.usuario).subscribe({
                next: () => {
                    this.alertService.success('Usuario creado correctamente.');
                    this.router.navigate(['/admin/users']);
                },
                error: (err: any) => {
                    console.error('Error creating user:', err);
                    const errorMessage = err.response?.data?.message || err.message || 'Error al crear usuario.';
                    this.alertService.error(errorMessage);
                    this.isLoading = false;
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/admin/users']);
    }
}
