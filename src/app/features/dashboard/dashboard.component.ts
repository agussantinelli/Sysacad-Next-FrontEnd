import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '@core/models/usuario.models';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { RouterLink } from '@angular/router';
import { AvisoService } from '@core/services/aviso.service';

interface DashboardOption {
    title: string;
    icon: string;
    route: string;
    disabled?: boolean;
    badgeCount?: number;
}

interface DashboardSection {
    title: string;
    options: DashboardOption[];
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, AlertMessageComponent, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './styles/dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private avisoService = inject(AvisoService);

    usuario: UsuarioResponse | null = null;
    greeting: string = '';
    successMessage: string | null = null;

    menuSections: DashboardSection[] = [
        {
            title: 'Inscripciones',
            options: [
                { title: 'Inscripción a Cursado', icon: 'edit_calendar', route: '/academic/inscription-course' },
                { title: 'Inscripción a Examen', icon: 'post_add', route: '/academic/inscription-exam' },
                { title: 'Mis Inscripciones', icon: 'list_alt', route: '/academic/my-inscriptions' },
            ]
        },
        {
            title: 'Consultas Académicas',
            options: [
                { title: 'Estado Académico', icon: 'school', route: '/academic/status' },
                { title: 'Materias del Plan', icon: 'book', route: '/academic/plan' },
                { title: 'Cursado y Notas', icon: 'grade', route: '/academic/current-enrollments' }
            ]
        },
        {
            title: 'Comunicación y Cuenta',
            options: [
                { title: 'Avisos', icon: 'notifications', route: '/announcements' },
                { title: 'Mensajes', icon: 'chat', route: '/messages' },
                { title: 'Cambio de Contraseña', icon: 'lock_reset', route: '/profile/change-password' }
            ]
        },
        {
            title: 'Trámites',
            options: [
                { title: 'Certificado Regularidad', icon: 'badge', route: '/procedures/regular-cert' },
                { title: 'Calendario Académico', icon: 'calendar_month', route: '/academic/calendar' }
            ]
        }
    ];

    adminSections: DashboardSection[] = [
        {
            title: 'Administración Académica',
            options: [
                { title: 'Facultades', icon: 'domain', route: '/admin/universities' },
                { title: 'Carreras', icon: 'school', route: '/admin/careers' },
                { title: 'Comisiones', icon: 'groups', route: '/admin/commissions' }
            ]
        },
        {
            title: 'Gestión Institucional',
            options: [
                { title: 'Usuarios', icon: 'group', route: '/admin/users' },
                { title: 'Inscripciones', icon: 'app_registration', route: '/admin/inscriptions' },
                { title: 'Matricular Alumno', icon: 'person_add', route: '/admin/enroll-student' }
            ]
        },
        {
            title: 'Gestión de Exámenes',
            options: [
                { title: 'Mesas de Examen', icon: 'assignment', route: '/admin/exam-tables' },
                { title: 'Estadísticas', icon: 'bar_chart', route: '/admin/statistics' }
            ]
        },
        {
            title: 'Trámites y Comunicación',
            options: [
                { title: 'Solicitudes Certificados', icon: 'badge', route: '/admin/certificate-requests' },
                { title: 'Avisos', icon: 'notifications', route: '/admin/announcements' },
                { title: 'Calendario Académico', icon: 'calendar_month', route: '/admin/calendar' }
            ]
        }
    ];

    professorSections: DashboardSection[] = [
        {
            title: 'Gestión Académica',
            options: [
                { title: 'Mis Materias', icon: 'class', route: '/professor/subjects' },
                { title: 'Mis Comisiones', icon: 'groups', route: '/professor/my-commissions' },
            ]
        },
        {
            title: 'Exámenes',
            options: [
                { title: 'Mesas de Examen', icon: 'assignment', route: '/professor/exams' },
                { title: 'Estadísticas', icon: 'bar_chart', route: '/professor/exam-statistics' }
            ]
        },
        {
            title: 'Comunicación y Cuenta',
            options: [
                { title: 'Avisos', icon: 'notifications', route: '/announcements' },
                { title: 'Mensajes', icon: 'chat', route: '/messages' },
                { title: 'Cambio de Contraseña', icon: 'lock_reset', route: '/profile/change-password' }
            ]
        },
        {
            title: 'Trámites',
            options: [
                { title: 'Certificado Docencia', icon: 'badge', route: '/professor/professor-cert' },
                { title: 'Calendario Académico', icon: 'calendar_month', route: '/academic/calendar' }
            ]
        }
    ];

    ngOnInit(): void {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.usuario = JSON.parse(userStr);
            this.setGreeting();
            this.loadUnreadNotices();
        }

        if (history.state.loginSuccess && !sessionStorage.getItem('welcomeShown')) {
            this.successMessage = '¡Bienvenido/a al Sistema de Gestión Académica!';
            sessionStorage.setItem('welcomeShown', 'true');
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

    loadUnreadNotices(): void {
        this.avisoService.obtenerCantidadSinLeer().subscribe({
            next: (count) => {
                this.updateBadgeCount('Avisos', count);
            },
            error: (err) => console.error('Error loading unread notices', err)
        });
    }

    updateBadgeCount(optionTitle: string, count: number): void {
        // Helper to update count in all sections
        const updateInSections = (sections: DashboardSection[]) => {
            for (const section of sections) {
                const option = section.options.find(o => o.title === optionTitle);
                if (option) {
                    option.badgeCount = count;
                }
            }
        };

        if (this.usuario?.rol === 'ESTUDIANTE') updateInSections(this.menuSections);
        else if (this.usuario?.rol === 'PROFESOR') updateInSections(this.professorSections);
        else if (this.usuario?.rol === 'ADMIN') updateInSections(this.adminSections);
    }
}
