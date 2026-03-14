import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let usuarioService: jasmine.SpyObj<UsuarioService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['cambiarPassword']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1' } as any)
        });
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'clear']);

        await TestBed.configureTestingModule({
            imports: [ChangePasswordComponent, NoopAnimationsModule, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: UsuarioService, useValue: usuarioSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: AlertService, useValue: alertSpy },
                FormBuilder
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should validate password mismatch', () => {
        component.passwordForm.patchValue({
            currentPassword: 'old',
            newPassword: 'new123',
            confirmPassword: 'new456'
        });
        expect(component.passwordForm.errors?.['mismatch']).toBeTrue();
    });

    it('should validate same as current password', () => {
        component.passwordForm.patchValue({
            currentPassword: 'password123',
            newPassword: 'password123',
            confirmPassword: 'password123'
        });
        expect(component.passwordForm.errors?.['sameAsCurrent']).toBeTrue();
    });

    it('should change password successfully', fakeAsync(() => {
        const alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
        usuarioService.cambiarPassword.and.returnValue(of(undefined));
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');

        component.passwordForm.patchValue({
            currentPassword: 'old',
            newPassword: 'newPassword123',
            confirmPassword: 'newPassword123'
        });

        component.onSubmit();
        tick(1500);

        expect(usuarioService.cambiarPassword).toHaveBeenCalledWith('1', {
            passwordActual: 'old',
            passwordNueva: 'newPassword123'
        });
        expect(alertService.success).toHaveBeenCalledWith('Contraseña actualizada correctamente.');
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should handle error when changing password', () => {
        const alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
        usuarioService.cambiarPassword.and.returnValue(throwError(() => ({ error: { message: 'Wrong password' } })));

        component.passwordForm.patchValue({
            currentPassword: 'wrong',
            newPassword: 'newPassword123',
            confirmPassword: 'newPassword123'
        });

        component.onSubmit();

        expect(alertService.error).toHaveBeenCalledWith('Wrong password');
        expect(component.isLoading).toBeFalse();
    });
});
