import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
    templateUrl: './forgot-password.component.html',
    styleUrl: './styles/forgot-password.component.css'
})
export class ForgotPasswordComponent {
    emailOrLegajo = new FormControl('', [Validators.required]);
    private themeService = inject(ThemeService);
    isLoading = false;

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    onSubmit() {
        if (this.emailOrLegajo.valid) {
            this.isLoading = true;
            setTimeout(() => {
                console.log('Recover password for:', this.emailOrLegajo.value);
                this.isLoading = false;
            }, 2000);
        }
    }
}
