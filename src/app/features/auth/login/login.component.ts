import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    private themeService = inject(ThemeService);

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get logoPath(): string {
        return this.themeService.isDarkMode() ? '/logo-utn-dark-mode.png' : '/logo-utn-light-mode.png';
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            // Simulate API call
            setTimeout(() => {
                console.log('Ingreso exitoso', this.loginForm.value);
                this.isLoading = false;
                // Navigate to dashboard or home
                // this.router.navigate(['/dashboard']);
            }, 1500);
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }
}
