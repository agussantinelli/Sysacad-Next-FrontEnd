import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../core/models/auth.models';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { AlertMessageComponent } from '../../shared/components/alert-message/alert-message.component';

interface DashboardOption {
    title: string;
    icon: string;
    route: string;
    disabled?: boolean;
}

interface DashboardSection {
    title: string;
    options: DashboardOption[];
}

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

    menuSections: DashboardSection[] = [
        {
            title: 'Inscripciones',
            options: [
                { title: 'Inscripción a Cursado', icon: 'edit_calendar', route: '/academic/inscription-course' },
                { title: 'Inscripción a Examen', icon: 'post_add', route: '/academic/inscription-exam' },
            ]
        },
        {
            title: 'Consultas Académicas',
            options: [
                { title: 'Estado Académico', icon: 'school', route: '/academic/status' },
                { title: 'Materias del Plan', icon: 'book', route: '/academic/plan' },
                { title: 'Cursado y Notas', icon: 'grade', route: '/academic/grades' },
                { title: 'Historia Académica', icon: 'history_edu', route: '/academic/history' } // "Exámenes" in legacy
            ]
        },
        {
            title: 'Correlatividades',
            options: [
                { title: 'Para Cursar', icon: 'schema', route: '/academic/correlatives-course' },
                { title: 'Para Rendir', icon: 'account_tree', route: '/academic/correlatives-exam' }
            ]
        },
        {
            title: 'Trámites y Otros',
            options: [
                { title: 'Certificado Regularidad', icon: 'badge', route: '/procedures/regular-cert' },
                { title: 'Calendario Académico', icon: 'calendar_month', route: '/academic/calendar' },
                { title: 'Avisos', icon: 'notifications', route: '/notifications' },
                { title: 'Cambio de Contraseña', icon: 'lock_reset', route: '/profile/change-password' }
            ]
        }
    ];

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
