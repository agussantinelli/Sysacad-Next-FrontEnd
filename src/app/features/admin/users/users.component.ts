import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AlertService } from '@core/services/alert.service';
import { UsuarioResponse, EstadoUsuario } from '@core/models/usuario.models';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './users.component.html',
    styleUrl: './styles/users.component.css'
})
export class UsersComponent implements OnInit {
    private usuarioService = inject(UsuarioService);
    private alertService = inject(AlertService);
    private router = inject(Router);

    usuarios: UsuarioResponse[] = [];
    isLoading = false;

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.isLoading = true;
        this.usuarioService.obtenerTodos().subscribe({
            next: (data) => {
                this.usuarios = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading users:', err);
                this.alertService.error('Error al cargar usuarios.');
                this.isLoading = false;
            }
        });
    }

    goToCreate() {
        this.router.navigate(['/admin/users/create']);
    }

    editUser(user: UsuarioResponse) {
        this.router.navigate(['/admin/users/edit', user.id]);
    }

    goToProfile(user: UsuarioResponse) {
        this.router.navigate(['/admin/profile', user.id]);
    }

    toggleState(user: UsuarioResponse) {
        const nuevoEstado = user.estado === EstadoUsuario.ACTIVO ? EstadoUsuario.INACTIVO : EstadoUsuario.ACTIVO;

        this.usuarioService.cambiarEstado(user.id, nuevoEstado).subscribe({
            next: (updatedUser) => {
                user.estado = updatedUser.estado;
                this.alertService.success(`Usuario ${nuevoEstado === EstadoUsuario.ACTIVO ? 'habilitado' : 'deshabilitado'} correctamente.`);
            },
            error: (err: any) => {
                console.error('Error changing user status:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar el estado del usuario.';
                this.alertService.error(errorMessage);
            }
        });
    }

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        // Adjust based on your backend config
        return `http://localhost:8080/${relativePath.startsWith('/') ? relativePath.substring(1) : relativePath}`;
    }
}
