import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../core/models/auth.models';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { AlertMessageComponent } from '../../shared/components/alert-message/alert-message.component';

// Dashboard component handling user welcome and status
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, NavbarComponent, AlertMessageComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './styles/dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    usuario: UsuarioResponse | null = null;
    greeting: string = '';
    successMessage: string | null = null;

    ngOnInit(): void {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.usuario = JSON.parse(userStr);
            this.setGreeting();
        }

        if (history.state.loginSuccess) {
            this.successMessage = '¡Bienvenido/a al Sistema de Gestión Académica!';
            setTimeout(() => {
                this.successMessage = null;
            }, 5000);
        }
    }

    setGreeting(): void {
        const hour = new Date().getHours();
        if (hour < 12) {
            this.greeting = 'Buenos días';
        } else if (hour < 20) {
            this.greeting = 'Buenas tardes';
        } else {
            this.greeting = 'Buenas noches';
        }
    }
}
