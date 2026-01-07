import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { UsuarioResponse } from '@core/models/usuario.models';
import { UploadModalComponent } from '@shared/components/upload-modal/upload-modal.component';
import { UsuarioService } from '@core/services/usuario.service';

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

    usuario: UsuarioResponse | null = null;
    showUploadModal = false;
    isUploadingPhoto = false;

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.usuario = JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }

    goBack(): void {
        this.location.back();
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
                    this.usuario = updatedUser;
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.isUploadingPhoto = false;
                    this.closeUploadModal();
                });
            },
            error: (err) => {
                console.error('Upload failed', err);
                this.isUploadingPhoto = false;
                // Handle error (alert?)
            }
        });
    }
}

