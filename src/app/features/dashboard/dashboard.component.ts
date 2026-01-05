import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../core/models/auth.models';
import { NavbarComponent } from '../../layout/navbar/navbar.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './styles/dashboard.component.css'
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
}
