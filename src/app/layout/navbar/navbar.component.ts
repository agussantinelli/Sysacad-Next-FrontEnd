import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { RouterLink } from '@angular/router';
import { UsuarioResponse } from '@core/models/usuario.models';
import { AvisoService } from '@core/services/aviso.service';

interface NavbarOption {
    title: string;
    icon: string;
    route: string;
    disabled?: boolean;
    badgeCount?: number;
}

interface NavbarSection {
    title: string;
    options: NavbarOption[];
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './styles/navbar.component.css'
})
export class NavbarComponent implements OnInit {
    private themeService = inject(ThemeService);
    private authService = inject(AuthService);
    private avisoService = inject(AvisoService);

    isDropdownOpen = false;
    activeSection: string | null = null;
    usuario: UsuarioResponse | null = null;

    menuSections: NavbarSection[] = [
        {
            title: 'Inscripciones',
            options: [
                { title: 'Inscripción a Cursado', icon: 'edit_calendar', route: '/academic/inscription-course' },
                { title: 'Inscripción a Examen', icon: 'post_add', route: '/academic/inscription-exam' },
                { title: 'Mis Inscripciones', icon: 'list_alt', route: '/academic/my-inscriptions' },
            ]
        },
        {
            title: 'Consultas',
            options: [
                { title: 'Estado Académico', icon: 'school', route: '/academic/status' },
                { title: 'Materias Plan', icon: 'book', route: '/academic/plan' },
                { title: 'Cursado y Notas', icon: 'grade', route: '/academic/current-enrollments' }
            ]
        },
        {
            title: 'Trámites',
            options: [
                { title: 'Certificados', icon: 'badge', route: '/procedures/regular-cert' },
                { title: 'Calendario', icon: 'calendar_month', route: '/academic/calendar' }
            ]
        },
        {
            title: 'Comunicación',
            options: [
                { title: 'Avisos', icon: 'notifications', route: '/announcements' },
                { title: 'Mensajes', icon: 'chat', route: '/messages' }
            ]
        }
    ];

    adminSections: NavbarSection[] = [
        {
            title: 'Académica',
            options: [
                { title: 'Carreras', icon: 'school', route: '/admin/carreras' },
                { title: 'Facultades', icon: 'domain', route: '/admin/facultades' },
                { title: 'Planes', icon: 'map', route: '/admin/planes' },
                { title: 'Materias', icon: 'book', route: '/admin/materias' }
            ]
        },
        {
            title: 'Institución',
            options: [
                { title: 'Usuarios', icon: 'group', route: '/admin/usuarios' },
                { title: 'Inscripciones', icon: 'app_registration', route: '/admin/inscripciones' }
            ]
        },
        {
            title: 'Exámenes',
            options: [
                { title: 'Mesas', icon: 'assignment', route: '/admin/mesas' },
                { title: 'Actas', icon: 'description', route: '/admin/actas' }
            ]
        },
        {
            title: 'Trámites',
            options: [
                { title: 'Certificados', icon: 'badge', route: '/admin/certificados' },
                { title: 'Avisos', icon: 'notifications', route: '/admin/avisos' },
                { title: 'Calendario', icon: 'calendar_month', route: '/admin/calendario' }
            ]
        }
    ];

    professorSections: NavbarSection[] = [
        {
            title: 'Gestión',
            options: [
                { title: 'Mis Materias', icon: 'class', route: '/professor/subjects' },
                { title: 'Mis Comisiones', icon: 'groups', route: '/professor/my-commissions' },
            ]
        },
        {
            title: 'Exámenes',
            options: [
                { title: 'Mesas', icon: 'assignment', route: '/professor/exams' },
                { title: 'Estadísticas', icon: 'bar_chart', route: '/professor/exam-statistics' }
            ]
        },
        {
            title: 'Comunicación',
            options: [
                { title: 'Avisos', icon: 'notifications', route: '/announcements' },
                { title: 'Mensajes', icon: 'chat', route: '/messages' }
            ]
        },
        {
            title: 'Trámites',
            options: [
                { title: 'Certificados', icon: 'badge', route: '/professor/professor-cert' },
                { title: 'Calendario', icon: 'calendar_month', route: '/academic/calendar' }
            ]
        }
    ];

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.usuario = user;
            if (user) {
                this.loadUnreadNotices();
            }
        });
    }

    loadUnreadNotices(): void {
        this.avisoService.obtenerCantidadSinLeer().subscribe({
            next: (count) => this.updateBadgeCount('Avisos', count),
            error: (err) => console.error(err)
        });
    }

    updateBadgeCount(optionTitle: string, count: number): void {
        const update = (sections: NavbarSection[]) => {
            sections.forEach(s => {
                const opt = s.options.find(o => o.title === optionTitle);
                if (opt) opt.badgeCount = count;
            });
        };

        if (this.usuario?.rol === 'ESTUDIANTE') update(this.menuSections);
        else if (this.usuario?.rol === 'PROFESOR') update(this.professorSections);
        else if (this.usuario?.rol === 'ADMIN') update(this.adminSections);
    }

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        // Assuming backend serves static files at root or /uploads
        // If relativePath starts with /, remove it to avoid double slash
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        return `http://localhost:8080/${cleanPath}`;
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
        this.activeSection = null; // Close other menus
    }

    setActiveSection(title: string | null): void {
        this.activeSection = this.activeSection === title ? null : title;
        this.isDropdownOpen = false; // Close user menu
    }

    closeAll(): void {
        this.activeSection = null;
        this.isDropdownOpen = false;
    }

    logout(): void {
        this.authService.logout();
    }
}
