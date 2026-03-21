/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { NavbarComponent } from 'src/app/layout/navbar/navbar.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of, BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('Navbar Integration', () => {
    let mockAuthService: any;
    let mockThemeService: any;
    let mockAvisoService: any;
    let mockChatService: any;

    beforeEach(() => {
        mockAuthService = {
            currentUser$: of({ id: 's1', nombre: 'Agustin', apellido: 'Santinelli', rol: 'ADMIN' }),
            logout: jasmine.createSpy('logout')
        };
        mockThemeService = {
            isDarkMode: () => false
        };
        mockAvisoService = {
            obtenerCantidadSinLeer: () => of(0)
        };
        mockChatService = {
            unreadCountChanged$: new BehaviorSubject(0),
            getTotalMensajesSinLeer: () => of(0)
        };
    });

    it('should show admin menu and logout correctly', async () => {
        const { fixture } = await render(NavbarComponent, {
            imports: [RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: ThemeService, useValue: mockThemeService },
                { provide: AvisoService, useValue: mockAvisoService },
                { provide: ChatService, useValue: mockChatService }
            ]
        });

        fixture.detectChanges();

        const adminBtn = await screen.findByRole('button', { name: /Académica/i });
        fireEvent.click(adminBtn);

        // Abrir menú de usuario
        const profileBtn = screen.getByRole('button', { name: /Agustin Santinelli/i });
        fireEvent.click(profileBtn);

        const logoutBtn = await screen.findByRole('button', { name: /Cerrar Sesión/i });
        fireEvent.click(logoutBtn);

        expect(mockAuthService.logout).toHaveBeenCalled();
    });
});
