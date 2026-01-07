import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { UsuarioResponse } from '@core/models/usuario.models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.component.html',
    styleUrl: './styles/profile.component.css'
})
export class ProfileComponent implements OnInit {
    private location = inject(Location);
    usuario: UsuarioResponse | null = null;

    ngOnInit(): void {
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
}
