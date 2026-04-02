import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ThemeService } from '@core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    template: `
    <div class="theme-toggle-container" cdkDrag>
        <button class="theme-toggle-switch" 
                (click)="themeService.toggleTheme()" 
                [class.dark]="themeService.isDarkMode()" 
                aria-label="Alternar tema oscuro">
            <span class="material-icons sun-icon" aria-hidden="true">light_mode</span>
            <span class="material-icons moon-icon" aria-hidden="true">dark_mode</span>
            <div class="toggle-circle"></div>
        </button>
    </div>
  `,
    styleUrl: './styles/theme-toggle.component.css'
})
export class ThemeToggleComponent {
    themeService = inject(ThemeService);
}
