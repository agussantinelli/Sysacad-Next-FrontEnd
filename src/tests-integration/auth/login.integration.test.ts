/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { LoginComponent } from '@features/auth/login/login.component';
import { AuthService } from '@core/services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('Login Integration', () => {
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
        (mockAuthService as any).currentUser$ = of(null);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    });

    it('should login successfully and redirect to dashboard', async () => {
        const userMock = { id: 1, role: 'STUDENT', nombre: 'Test User' };
        mockAuthService.login.and.returnValue(of(userMock as any));

        const { fixture } = await render(LoginComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fixture.detectChanges();

        const emailInput = screen.getByLabelText(/Gmail/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);
        const submitBtn = screen.getByRole('button', { name: /Ingresar/i });

        fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.input(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockAuthService.login).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
        });
    });

    it('should show error message on failed login', async () => {
        mockAuthService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

        const { fixture } = await render(LoginComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fixture.detectChanges();

        fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeTruthy();
        });
    });
});
