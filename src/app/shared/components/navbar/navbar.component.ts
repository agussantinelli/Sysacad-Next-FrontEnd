import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './styles/navbar.component.css'
})
export class NavbarComponent {
    private themeService = inject(ThemeService);

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    }
}
