import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button class="theme-toggle-switch" 
            (click)="themeService.toggleTheme()" 
            [class.dark]="themeService.isDarkMode()" 
            aria-label="Toggle Dark Mode">
        <span class="material-icons sun-icon">light_mode</span>
        <span class="material-icons moon-icon">dark_mode</span>
        <div class="toggle-circle"></div>
    </button>
  `,
    styleUrl: './styles/theme-toggle.component.css'
})
export class ThemeToggleComponent {
    themeService = inject(ThemeService);
}
