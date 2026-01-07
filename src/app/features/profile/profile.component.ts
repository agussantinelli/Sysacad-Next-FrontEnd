import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '@core/models/usuario.models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.component.html',
    styleUrl: './styles/profile.component.css'
})
export class ProfileComponent implements OnInit {
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
}
