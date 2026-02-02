import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioResponse } from '@core/models/usuario.models';
import { UploadModalComponent } from '@shared/components/upload-modal/upload-modal.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, UploadModalComponent],
    templateUrl: './profile.component.html',
    styleUrl: './styles/profile.component.css'
})
export class ProfileComponent implements OnInit {
    private location = inject(Location);
    private usuarioService = inject(UsuarioService);
    private authService = inject(AuthService);
    private router = inject(Router);

    usuario: UsuarioResponse | null = null;
    showUploadModal = false;
    isUploadingPhoto = false;

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser() {
        // Subscribe to auth service state
        this.authService.currentUser$.subscribe(user => {
            this.usuario = user;
        });

        // Optionally still fetch fresh data if needed, but update via AuthService
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const localUser = JSON.parse(userStr);
                // If we have an ID, fetch fresh data to ensure we aren't stale
                if (localUser && localUser.id) {
                    this.usuarioService.obtenerPorId(localUser.id).subscribe({
                        next: (data) => {
                            // Update global auth state with fresh data
                            this.authService.updateUser(data);
                        },
                        error: (err) => console.error('Error fetching fresh user data', err)
                    });
                }
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }

    openUploadModal() {
        this.showUploadModal = true;
    }

    closeUploadModal() {
        if (!this.isUploadingPhoto) {
            this.showUploadModal = false;
        }
    }

    handlePhotoUpload(file: File) {
        if (!this.usuario) return;

        this.isUploadingPhoto = true;

        this.usuarioService.subirFotoPerfil(this.usuario.id, file).subscribe({
            next: () => {
                this.usuarioService.obtenerPorId(this.usuario!.id).subscribe(updatedUser => {
                    this.authService.updateUser(updatedUser); // Update global state
                    this.isUploadingPhoto = false;
                    this.closeUploadModal();
                });
            },
            error: (err) => {
                console.error('Upload failed', err);
                this.isUploadingPhoto = false;
            }
        });
    }

    get isProfileComplete(): boolean {
        if (!this.usuario) return false;
        return !!(
            this.usuario.dni &&
            this.usuario.nombre &&
            this.usuario.apellido &&
            this.usuario.mail &&
            this.usuario.fechaNacimiento &&
            this.usuario.genero &&
            this.usuario.telefono &&
            this.usuario.direccion &&
            this.usuario.ciudad
        );
    }

    navigateToEdit() {
        this.router.navigate(['/profile/edit']);
    }

    navigateToChangePassword() {
        this.router.navigate(['/profile/change-password']);
    }
}
