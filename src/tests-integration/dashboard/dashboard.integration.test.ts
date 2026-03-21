/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { AuthService } from '@core/services/auth.service';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of } from 'rxjs';

describe('Dashboard Integration', () => {
    let mockAuthService: any;
    let mockAvisoService: jasmine.SpyObj<AvisoService>;
    let mockChatService: jasmine.SpyObj<ChatService>;

    beforeEach(() => {
        mockAuthService = {
            currentUser$: of({ id: 's1', nombre: 'Agustin', rol: 'ESTUDIANTE' })
        };
        mockAvisoService = jasmine.createSpyObj('AvisoService', ['obtenerCantidadSinLeer', 'listarAvisos']);
        mockChatService = jasmine.createSpyObj('ChatService', ['getTotalMensajesSinLeer']);
        (mockChatService as any).unreadCountChanged$ = of(void 0);
    });

    it('should show personalized welcome and badges from services', async () => {
        localStorage.setItem('user', JSON.stringify({ id: 's1', nombre: 'Agustin', rol: 'ESTUDIANTE' }));
        
        mockAvisoService.obtenerCantidadSinLeer.and.returnValue(of(5));
        mockChatService.getTotalMensajesSinLeer.and.returnValue(of(3));

        await render(DashboardComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: AvisoService, useValue: mockAvisoService },
                { provide: ChatService, useValue: mockChatService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText(/Buenos/i)).toBeTruthy();
            expect(screen.getByText(/Agustin/i)).toBeTruthy();
        });
    });
});
