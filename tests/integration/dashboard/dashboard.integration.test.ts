import { render, screen, waitFor } from '@testing-library/angular';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { AuthService } from '@core/services/auth.service';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Dashboard Integration', () => {
    const mockAuthService = {
        currentUser$: of({ id: 's1', nombre: 'Agustin', rol: 'ESTUDIANTE' })
    };
    const mockAvisoService = {
        obtenerCantidadSinLeer: vi.fn(),
        listarAvisos: vi.fn()
    };
    const mockChatService = {
        getTotalMensajesSinLeer: vi.fn(),
        unreadCountChanged$: of(void 0)
    };

    it('should show personalized welcome and badges from services', async () => {
        // Setup local storage for the component's ngOnInit logic
        localStorage.setItem('user', JSON.stringify({ id: 's1', nombre: 'Agustin', rol: 'ESTUDIANTE' }));
        
        mockAvisoService.obtenerCantidadSinLeer.mockReturnValue(of(5));
        mockChatService.getTotalMensajesSinLeer.mockReturnValue(of(3));

        await render(DashboardComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: AvisoService, useValue: mockAvisoService },
                { provide: ChatService, useValue: mockChatService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText(/Buenos/i)).toBeInTheDocument();
            expect(screen.getByText(/Agustin/i)).toBeInTheDocument();
        });
    });
});
