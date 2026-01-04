import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    // ... (imports remain)
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
    // ... (get logoPath remains)

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = null;

            const { email, password } = this.loginForm.value;
            // Map email/legajo input to 'identificador'
            const loginRequest = {
                identificador: email,
                password: password,
                // We might deduce tipoIdentificador based on regex (email vs number) if needed, 
                // but for now backend might handle it or we just send it as is.
                // The provided LoginRequest has 'identificador'.
            };

            this.authService.login(loginRequest).subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    // Store user data/token logic here
                    localStorage.setItem('user', JSON.stringify(response));
                    this.isLoading = false;
                    // Navigate to home/dashboard
                    // this.router.navigate(['/home']); 
                },
                error: (error) => {
                    console.error('Login failed', error);
                    this.isLoading = false;
                    this.errorMessage = 'Credenciales inválidas o error en el servidor';
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }
}
