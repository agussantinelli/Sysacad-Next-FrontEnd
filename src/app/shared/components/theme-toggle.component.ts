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
    styles: [`
    .theme-toggle-switch {
      position: fixed; /* Fixed so it floats on top of all pages */
      top: 20px;
      right: 20px;
      width: 70px;
      height: 36px;
      background: #e2e8f0;
      border: none;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      overflow: hidden;
      z-index: 1000; /* Ensure it's above everything */
    }

    .theme-toggle-switch.dark {
      background: #334155;
    }

    .sun-icon,
    .moon-icon {
      font-size: 1.2rem;
      z-index: 1;
      transition: color 0.3s ease;
    }

    .sun-icon {
      color: #f59e0b;
    }

    .moon-icon {
      color: #94a3b8;
    }

    .theme-toggle-switch.dark .sun-icon {
      color: #64748b;
    }

    .theme-toggle-switch.dark .moon-icon {
      color: #fff;
    }

    .toggle-circle {
      position: absolute;
      left: 4px;
      width: 28px;
      height: 28px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      z-index: 0;
    }

    .theme-toggle-switch.dark .toggle-circle {
      transform: translateX(34px);
    }
    
    /* Hover effect */
    .theme-toggle-switch:hover {
        transform: scale(1.05);
    }
  `]
})
export class ThemeToggleComponent {
    themeService = inject(ThemeService);
}
