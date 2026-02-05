import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UsuarioResponse } from '@core/models/usuario.models';
import { UsuarioService } from '@core/services/usuario.service';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertService } from '@core/services/alert.service';

@Component({
    selector: 'app-admin-user-profile',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './admin-user-profile.component.html',
    styleUrl: './styles/admin-user-profile.component.css'
})
export class AdminUserProfileComponent implements OnInit {
    private usuarioService = inject(UsuarioService);
    private route = inject(ActivatedRoute);
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

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        return `http://localhost:8080/${relativePath.startsWith('/') ? relativePath.substring(1) : relativePath}`;
    }
}
