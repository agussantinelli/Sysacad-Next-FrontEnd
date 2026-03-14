import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let themeService: jasmine.SpyObj<ThemeService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);

        await TestBed.configureTestingModule({
            imports: [ForgotPasswordComponent, NoopAnimationsModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ThemeService, useValue: themeSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should validate email/legajo as required', () => {
        component.emailOrLegajo.setValue('');
        expect(component.emailOrLegajo.valid).toBeFalse();

        component.emailOrLegajo.setValue('admin@test.com');
        expect(component.emailOrLegajo.valid).toBeTrue();
    });

    it('should return correct logo path based on theme', () => {
        themeService.isDarkMode.and.returnValue(false);
        expect(component.logoPath).toBe('/logo-utn-light-mode.png');

        themeService.isDarkMode.and.returnValue(true);
        expect(component.logoPath).toBe('/logo-utn-dark-mode.png');
    });

    it('should call authService.forgotPassword on valid submit', () => {
        authService.forgotPassword.and.returnValue(of({} as any));
        component.emailOrLegajo.setValue('user@test.com');

        component.onSubmit();

        expect(authService.forgotPassword).toHaveBeenCalledWith({ identificador: 'user@test.com' });
        expect(component.isLoading).toBeFalse();
        expect(component.successMessage).toBe('Se han enviado las instrucciones de recuperación a tu correo.');
        expect(component.emailOrLegajo.value).toBeNull();
    });

    it('should handle submission error', () => {
        const errorResponse = { response: { data: { message: 'User not found' } } };
        authService.forgotPassword.and.returnValue(throwError(() => ({ status: 404 })));

        component.emailOrLegajo.setValue('unknown@test.com');
        component.onSubmit();

        expect(component.errorMessage).toBe('User not found');
        expect(component.isLoading).toBeFalse();
    });

    it('should handle generic submission error', () => {
        authService.forgotPassword.and.returnValue(throwError(() => new Error('Network error')));

        component.emailOrLegajo.setValue('user@test.com');
        component.onSubmit();

        expect(component.errorMessage).toBe('Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.');
    });
});
