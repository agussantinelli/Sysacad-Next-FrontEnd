import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioResponse, EstadoUsuario } from '@core/models/usuario.models';
import { UsuarioService } from '@core/services/usuario.service';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertService } from '@core/services/alert.service';

@Component({
    selector: 'app-admin-user-profile',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './admin-user-profile.component.html',
    styleUrl: './styles/admin-user-profile.component.css'
})
export class AdminUserProfileComponent implements OnInit {
    private usuarioService = inject(UsuarioService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private alertService = inject(AlertService);

    usuario: UsuarioResponse | null = null;
    isLoading = false;

    ngOnInit(): void {
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
            this.loadUser(userId);
        }
    }

    loadUser(id: string) {
        this.isLoading = true;
        this.usuarioService.obtenerPorId(id).subscribe({
            next: (data) => {
                this.usuario = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading user profile:', err);
                this.alertService.error('Error al cargar cargar el perfil del usuario.');
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }

    editUser() {
        if (this.usuario) {
            this.router.navigate(['/admin/users/edit', this.usuario.id]);
        }
    }

    toggleState() {
        if (!this.usuario) return;

        const nuevoEstado = this.usuario.estado === EstadoUsuario.ACTIVO ? EstadoUsuario.INACTIVO : EstadoUsuario.ACTIVO;
        const actionVerb = nuevoEstado === EstadoUsuario.ACTIVO ? 'habilitar' : 'deshabilitar';

        if (confirm(`¿Está seguro de ${actionVerb} al usuario ${this.usuario.nombre} ${this.usuario.apellido}?`)) {
            this.usuarioService.cambiarEstado(this.usuario.id, nuevoEstado).subscribe({
                next: (updatedUser) => {
                    if (this.usuario) this.usuario.estado = updatedUser.estado;
                    this.alertService.success(`Usuario ${nuevoEstado === EstadoUsuario.ACTIVO ? 'habilitado' : 'deshabilitado'} correctamente.`);
                },
                error: (err) => {
                    console.error('Error changing user status:', err);
                    this.alertService.error('Error al cambiar el estado del usuario.');
                }
            });
        }
    }

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        return `http://localhost:8080/${relativePath.startsWith('/') ? relativePath.substring(1) : relativePath}`;
    }
}
