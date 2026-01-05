import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './styles/login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage: string | null = null;

    private themeService = inject(ThemeService);
    private authService = inject(AuthService);

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
            this.errorMessage = null;

            const { email, password } = this.loginForm.value;

            const loginRequest = {
                identificador: email,
                password: password
            };

            this.authService.login(loginRequest).subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    localStorage.setItem('user', JSON.stringify(response));
                    localStorage.setItem('token', 'dummy-token'); // backend didn't return token in snippet, likely session or cookie, or just user data for now.
                    this.isLoading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Login failed', error);
                    this.isLoading = false;
                    if (error.status === 401) {
                        this.errorMessage = 'Usuario o contraseña incorrectos';
                    } else {
                        this.errorMessage = 'Error de conexión con el servidor: ' + error.message;
                    }
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }
}
