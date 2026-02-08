import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { CambioPasswordRequest } from '@core/models/usuario.models';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, PageLayoutComponent],
    templateUrl: './change-password.component.html',
    styleUrls: ['./styles/change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    private fb = inject(FormBuilder);
    private usuarioService = inject(UsuarioService);
    private authService = inject(AuthService);
    private alertService = inject(AlertService);
    private location = inject(Location);
    private router = inject(Router);

    passwordForm: FormGroup;
    isLoading = false;

    constructor() {
        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordValidators });
    }

    ngOnInit(): void {
    }

    passwordValidators(control: AbstractControl): ValidationErrors | null {
        const currentPassword = control.get('currentPassword')?.value;
        const newPassword = control.get('newPassword')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        const errors: ValidationErrors = {};
        let hasError = false;

        
        if (currentPassword && newPassword && currentPassword === newPassword) {
            errors['sameAsCurrent'] = true;
            hasError = true;
        }

        
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            errors['mismatch'] = true;
            hasError = true;
        }

        return hasError ? errors : null;
    }

    onSubmit() {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.alertService.clear();

        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (!user) {
                this.alertService.error('No se ha podido identificar al usuario.');
                this.isLoading = false;
                return;
            }

            const request: CambioPasswordRequest = {
                passwordActual: this.passwordForm.get('currentPassword')?.value,
                passwordNueva: this.passwordForm.get('newPassword')?.value
            };

            this.usuarioService.cambiarPassword(user.id, request).subscribe({
                next: () => {
                    this.alertService.success('Contraseña actualizada correctamente.');
                    this.passwordForm.reset();
                    this.isLoading = false;
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 1500);
                },
                error: (err) => {
                    console.error('Error changing password:', err);
                    const msg = err.error?.message || 'Error al actualizar la contraseña. Verifica que la contraseña actual sea correcta.';
                    this.alertService.error(msg);
                    this.isLoading = false;
                }
            });
        });
    }

    goBack() {
        this.location.back();
    }
}
