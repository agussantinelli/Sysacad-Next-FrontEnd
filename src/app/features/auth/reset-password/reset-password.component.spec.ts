import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);
        const activatedRouteSpy = {
            snapshot: { queryParamMap: { get: jasmine.createSpy('get').and.returnValue('test-token') } }
        };

        await TestBed.configureTestingModule({
            imports: [ResetPasswordComponent, NoopAnimationsModule, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ThemeService, useValue: themeSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                FormBuilder
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should initialize token from route', () => {
        fixture.detectChanges();
        expect(component.token).toBe('test-token');
    });

    it('should set error message if token is missing', () => {
        const route = TestBed.inject(ActivatedRoute);
        (route.snapshot.queryParamMap.get as jasmine.Spy).and.returnValue(null);
        
        component.ngOnInit();
        expect(component.errorMessage).toBe('Token de recuperación no válido o ausente.');
    });

    it('should validate password length', () => {
        const password = component.resetForm.get('password');
        password?.setValue('12345');
        expect(password?.valid).toBeFalse();
        expect(password?.errors?.['minlength']).toBeTruthy();
    });

    it('should validate password match', () => {
        component.resetForm.patchValue({
            password: 'password123',
            confirmPassword: 'password456'
        });
        expect(component.resetForm.errors?.['mismatch']).toBeTrue();

        component.resetForm.patchValue({
            confirmPassword: 'password123'
        });
        expect(component.resetForm.errors).toBeNull();
    });

    it('should call authService.resetPassword on valid submission', (done) => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        authService.resetPassword.and.returnValue(of(undefined as any));

        component.token = 'valid-token';
        component.resetForm.patchValue({
            password: 'newpassword123',
            confirmPassword: 'newpassword123'
        });

        component.onSubmit();

        expect(authService.resetPassword).toHaveBeenCalledWith({
            token: 'valid-token',
            newPassword: 'newpassword123'
        });
        expect(component.isLoading).toBeFalse();
        expect(component.successMessage).toContain('éxito');

        // Check for navigation call after timeout
        setTimeout(() => {
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
            done();
        }, 3100);
    });

    it('should handle reset password error', () => {
        const errorResponse = { response: { data: { message: 'Expired token' } } };
        authService.resetPassword.and.returnValue(throwError(() => ({ response: { data: { message: 'Expired token' } } })));
        component.token = 'expired-token';
        component.resetForm.patchValue({
            password: 'newpassword123',
            confirmPassword: 'newpassword123'
        });

        component.onSubmit();

        expect(component.errorMessage).toBe('Expired token');
        expect(component.isLoading).toBeFalse();
    });
});
