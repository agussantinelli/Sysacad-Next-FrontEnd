import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { LoginComponent } from '@features/auth/login/login.component';
import { AuthService } from '@core/services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Login Integration', () => {
    const mockAuthService = {
        login: vi.fn(),
        currentUser$: of(null)
    };
    const mockRouter = {
        navigate: vi.fn()
    };

    it('should login successfully and redirect to dashboard', async () => {
        const userMock = { id: 1, role: 'STUDENT', nombre: 'Test User' };
        mockAuthService.login.mockReturnValue(of(userMock));

        await render(LoginComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
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
        mockAuthService.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));

        await render(LoginComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });
    });
});
