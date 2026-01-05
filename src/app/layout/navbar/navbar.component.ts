import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

interface NavbarOption {
    title: string;
    icon: string;
    route: string;
    disabled?: boolean;
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
export class NavbarComponent {
    private themeService = inject(ThemeService);
    private authService = inject(AuthService);

    isDropdownOpen = false;
    activeSection: string | null = null;

    menuSections: NavbarSection[] = [
        {
            title: 'Inscripciones',
            options: [
                { title: 'Cursado', icon: 'edit_calendar', route: '/academic/inscription-course' },
                { title: 'Examen', icon: 'post_add', route: '/academic/inscription-exam' },
            ]
        },
        {
            title: 'Consultas',
            options: [
                { title: 'Estado Académico', icon: 'school', route: '/academic/status' },
                { title: 'Materias Plan', icon: 'book', route: '/academic/plan' },
                { title: 'Cursado/Notas', icon: 'grade', route: '/academic/grades' },
                { title: 'Hist. Académica', icon: 'history_edu', route: '/academic/history' }
            ]
        },
        {
            title: 'Correlativas',
            options: [
                { title: 'Para Cursar', icon: 'schema', route: '/academic/correlatives-course' },
                { title: 'Para Rendir', icon: 'account_tree', route: '/academic/correlatives-exam' }
            ]
        },
        {
            title: 'Trámites',
            options: [
                { title: 'Certificados', icon: 'badge', route: '/procedures/regular-cert' },
                { title: 'Calendario', icon: 'calendar_month', route: '/academic/calendar' },
                { title: 'Avisos', icon: 'notifications', route: '/notifications' }
            ]
        }
    ];

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
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
