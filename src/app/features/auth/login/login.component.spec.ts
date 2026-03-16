import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let themeService: jasmine.SpyObj<ThemeService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['login']);
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, NoopAnimationsModule, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ThemeService, useValue: themeSpy },
                FormBuilder
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should initialize with invalid form', () => {
        fixture.detectChanges();
        expect(component.loginForm.valid).toBeFalse();
    });

    it('should validate email and password as required', () => {
        fixture.detectChanges();
        const email = component.loginForm.get('email');
        const password = component.loginForm.get('password');

        email?.setValue('');
        password?.setValue('');
        expect(email?.valid).toBeFalse();
        expect(password?.valid).toBeFalse();

        email?.setValue('test@test.com');
        password?.setValue('123456');
        expect(email?.valid).toBeTrue();
        expect(password?.valid).toBeTrue();
    });

    it('should validate password minimum length', () => {
        fixture.detectChanges();
        const password = component.loginForm.get('password');
        password?.setValue('12345');
        expect(password?.valid).toBeFalse();
        expect(password?.errors?.['minlength']).toBeTruthy();
    });

    it('should return correct logo path based on theme', () => {
        themeService.isDarkMode.and.returnValue(false);
        expect(component.logoPath).toBe('/logo-utn-light-mode.png');

        themeService.isDarkMode.and.returnValue(true);
        expect(component.logoPath).toBe('/logo-utn-dark-mode.png');
    });

    it('should call authService.login on valid submit', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        authService.login.and.returnValue(of({ token: 'test-token' } as any));

        component.loginForm.setValue({
            email: 'admin@test.com',
            password: 'password123'
        });

        component.onSubmit();

        expect(authService.login).toHaveBeenCalledWith({
            identificador: 'admin@test.com',
            password: 'password123'
        });
        expect(component.isLoading).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], { state: { loginSuccess: true } });
    });

    it('should set error message on 401 failure', () => {
        const errorResponse = { response: { status: 401 } };
        authService.login.and.returnValue(throwError(() => errorResponse));

        component.loginForm.setValue({
            email: 'wrong@test.com',
            password: 'password123'
        });

        component.onSubmit();
 
        expect(component.errorMessage).toBe('Credenciales inválidas. Por favor, verifique su usuario y contraseña.');
        expect(component.isLoading).toBeFalse();
    });

    it('should handle generic server errors', () => {
        const errorResponse = { response: { data: { message: 'Server error' } } };
        authService.login.and.returnValue(throwError(() => errorResponse));

        component.loginForm.setValue({
            email: 'admin@test.com',
            password: 'password123'
        });

        component.onSubmit();
 
        expect(component.errorMessage).toBe('Ha ocurrido un error inesperado: Server error');
    });

    it('should mark form as touched if invalid submit', () => {
        spyOn(component.loginForm, 'markAllAsTouched');
        component.loginForm.setValue({ email: '', password: '' });
        
        component.onSubmit();
        
        expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
        expect(authService.login).not.toHaveBeenCalled();
    });
});
