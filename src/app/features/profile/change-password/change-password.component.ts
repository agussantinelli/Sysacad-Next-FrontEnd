import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

    passwordForm: FormGroup;
    isLoading = false;

    constructor() {
        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');

        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            return { mismatch: true };
        }
        return null;
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
                this.alertService.error('⚠️ No se ha podido identificar al usuario.');
                this.isLoading = false;
                return;
            }

            const request: CambioPasswordRequest = {
                passwordActual: this.passwordForm.get('currentPassword')?.value,
                passwordNueva: this.passwordForm.get('newPassword')?.value
            };

            this.usuarioService.cambiarPassword(user.id, request).subscribe({
                next: () => {
                    this.alertService.success('✅ Contraseña actualizada correctamente.');
                    this.passwordForm.reset();
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error changing password:', err);
                    const msg = err.error?.message || 'Error al actualizar la contraseña. Verifica que la contraseña actual sea correcta.';
                    this.alertService.error(`❌ ${msg}`);
                    this.isLoading = false;
                }
            });
        });
    }

    goBack() {
        this.location.back();
    }
}
