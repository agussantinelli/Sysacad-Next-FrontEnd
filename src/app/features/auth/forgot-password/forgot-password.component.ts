import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrl: './styles/forgot-password.component.css'
})
export class ForgotPasswordComponent {
    emailOrLegajo = new FormControl('', [Validators.required]);
    privatethemeService = inject(ThemeService);
    // Typo above intended to be fixed or just quick scaffold? Wait, let's make it clean.
    private themeService = inject(ThemeService);

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    onSubmit() {
        if (this.emailOrLegajo.valid) {
            console.log('Recover password for:', this.emailOrLegajo.value);
            // Logic to be implemented later
        }
    }
}
