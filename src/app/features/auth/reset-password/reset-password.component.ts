import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent, AlertMessageComponent],
    templateUrl: './reset-password.component.html',
    styleUrl: './styles/reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    token: string | null = null;
    isLoading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);
    private themeService = inject(ThemeService);

    constructor() {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.token = this.route.snapshot.queryParamMap.get('token');
        if (!this.token) {
            this.errorMessage = 'Token de recuperación no válido o ausente.';
        }
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    onSubmit() {
        if (this.resetForm.valid && this.token) {
            this.isLoading = true;
            this.successMessage = null;
            this.errorMessage = null;

            this.authService.resetPassword({
                token: this.token,
                newPassword: this.resetForm.value.password
            }).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.successMessage = 'Tu contraseña ha sido restablecida con éxito. Redirigiendo al inicio de sesión...';
                    setTimeout(() => this.router.navigate(['/login']), 3000);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Error in reset password', err);
                    this.errorMessage = err.response?.data?.message || 'Error al restablecer la contraseña. Es posible que el token haya expirado.';
                }
            });
        }
    }

    get password() { return this.resetForm.get('password'); }
    get confirmPassword() { return this.resetForm.get('confirmPassword'); }
}
