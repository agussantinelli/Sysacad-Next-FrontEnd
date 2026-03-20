import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { NavbarComponent } from '@/app/layout/navbar/navbar.component';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Navbar Integration', () => {
    const mockAuthService = {
        currentUser$: of({ id: 's1', nombre: 'Agustin', rol: 'ADMIN' }),
        logout: vi.fn()
    };
    const mockRouter = {
        navigate: vi.fn()
    };

    it('should show admin menu and logout correctly', async () => {
        await render(NavbarComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        const menuBtn = screen.getByRole('button', { name: /Menu/i });
        fireEvent.click(menuBtn);

        await waitFor(() => {
            expect(screen.getByText(/Administración/i)).toBeInTheDocument();
        });

        const logoutBtn = screen.getByText(/Cerrar Sesión/i);
        fireEvent.click(logoutBtn);

        expect(mockAuthService.logout).toHaveBeenCalled();
    });
});
