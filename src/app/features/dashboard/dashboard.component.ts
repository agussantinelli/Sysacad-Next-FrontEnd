import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../core/models/auth.models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    usuario: UsuarioResponse | null = null;
    greeting: string = '';

    ngOnInit(): void {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.usuario = JSON.parse(userStr);
            this.setGreeting();
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

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload(); // Simple reload to go back to guard/login logic
    }
}
