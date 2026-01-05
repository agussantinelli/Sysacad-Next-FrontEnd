import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent, AlertMessageComponent],
    templateUrl: './forgot-password.component.html',
    styleUrl: './styles/forgot-password.component.css'
})
export class ForgotPasswordComponent {
    emailOrLegajo = new FormControl('', [Validators.required]);
    private themeService = inject(ThemeService);
    isLoading = false;
    successMessage: string | null = null;

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    onSubmit() {
        if (this.emailOrLegajo.valid) {
            this.isLoading = true;
            this.successMessage = null;

            setTimeout(() => {
                this.isLoading = false;
                this.successMessage = 'Se han enviado las instrucciones de recuperación.';
                this.emailOrLegajo.reset();
            }, 2000);
        }
    }
}
