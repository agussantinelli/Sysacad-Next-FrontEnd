import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    template: `
    <div class="theme-toggle-container" cdkDrag>
        <button class="theme-toggle-switch" 
                (click)="themeService.toggleTheme()" 
                [class.dark]="themeService.isDarkMode()" 
                aria-label="Toggle Dark Mode">
            <span class="material-icons sun-icon">light_mode</span>
            <span class="material-icons moon-icon">dark_mode</span>
            <div class="toggle-circle"></div>
        </button>
    </div>
  `,
    styleUrl: './styles/theme-toggle.component.css'
})
export class ThemeToggleComponent {
    themeService = inject(ThemeService);
}
