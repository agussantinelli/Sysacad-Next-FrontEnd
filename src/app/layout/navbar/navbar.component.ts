import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

import { RouterLink } from '@angular/router';

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

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    logout(): void {
        this.authService.logout();
    }
}
