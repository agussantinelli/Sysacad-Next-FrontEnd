/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { NavbarComponent } from '@layout/navbar/navbar.component';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('Navbar Integration', () => {
    let mockAuthService: any;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        mockAuthService = {
            currentUser$: of({ id: 's1', nombre: 'Agustin', rol: 'ADMIN' }),
            logout: jasmine.createSpy('logout')
        };
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    });

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
            expect(screen.getByText(/Administración/i)).toBeTruthy();
        });

        const logoutBtn = screen.getByText(/Cerrar Sesión/i);
        fireEvent.click(logoutBtn);

        expect(mockAuthService.logout).toHaveBeenCalled();
    });
});
