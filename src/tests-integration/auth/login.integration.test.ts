/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { LoginComponent } from '@features/auth/login/login.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Integration', () => {
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockThemeService: jasmine.SpyObj<ThemeService>;
    let router: Router;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
        (mockAuthService as any).currentUser$ = of(null);
        mockThemeService = jasmine.createSpyObj('ThemeService', ['isDarkMode']);

        mockThemeService.isDarkMode.and.returnValue(false);
    });

    const setup = async () => {
        const result = await render(LoginComponent, {
            imports: [ReactiveFormsModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: ThemeService, useValue: mockThemeService }
            ]
        });
        router = result.fixture.debugElement.injector.get(Router);
        spyOn(router, 'navigate');
        return result;
    };

    it('should login successfully and redirect to dashboard', async () => {
        const userMock = { id: 1, role: 'STUDENT', nombre: 'Test User' };
        mockAuthService.login.and.returnValue(of(userMock as any));

        await setup();

        const emailInput = screen.getByLabelText(/Gmail o Legajo/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);
        const submitBtn = screen.getByRole('button', { name: /Ingresar/i });

        fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.input(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockAuthService.login).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], jasmine.any(Object));
        });
    });

    it('should show error message on failed login', async () => {
        mockAuthService.login.and.returnValue(throwError(() => ({ response: { status: 401 } })));

        await setup();

        const emailInput = screen.getByLabelText(/Gmail o Legajo/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);
        const submitBtn = screen.getByRole('button', { name: /Ingresar/i });

        fireEvent.input(emailInput, { target: { value: 'wrong@test.com' } });
        fireEvent.input(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeTruthy();
        });
    });
});
