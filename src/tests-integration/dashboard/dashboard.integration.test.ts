/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of, BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('Dashboard Integration', () => {
    let mockAvisoService: jasmine.SpyObj<AvisoService>;
    let mockChatService: jasmine.SpyObj<ChatService>;

    beforeEach(() => {
        mockAvisoService = jasmine.createSpyObj('AvisoService', ['obtenerCantidadSinLeer']);
        mockChatService = jasmine.createSpyObj('ChatService', ['getTotalMensajesSinLeer']);
        (mockChatService as any).unreadCountChanged$ = new BehaviorSubject(0);
        
        mockAvisoService.obtenerCantidadSinLeer.and.returnValue(of(2));
        mockChatService.getTotalMensajesSinLeer.and.returnValue(of(5));

        // Mock localStorage for the component's ngOnInit
        const userMock = { id: 's1', nombre: 'Agustin', rol: 'ESTUDIANTE' };
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            if (key === 'user') return JSON.stringify(userMock);
            return null;
        });
    });

    it('should show personalized welcome and badges from services', async () => {
        await render(DashboardComponent, {
            imports: [RouterTestingModule],
            providers: [
                { provide: AvisoService, useValue: mockAvisoService },
                { provide: ChatService, useValue: mockChatService }
            ]
        });

        await waitFor(() => {
            // 'Buen' matches 'Buenos días', 'Buenas tardes', etc.
            expect(screen.getByText(/Buen/i)).toBeTruthy();
            expect(screen.getByText(/Agustin/i)).toBeTruthy();
        });

        // Verificar badges
        await waitFor(() => {
            expect(mockAvisoService.obtenerCantidadSinLeer).toHaveBeenCalled();
            expect(mockChatService.getTotalMensajesSinLeer).toHaveBeenCalled();
        });
    });
});
