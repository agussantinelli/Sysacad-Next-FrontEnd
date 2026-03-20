import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { MessagesComponent } from '@features/messages/messages.component';
import { ChatService } from '@core/services/chat.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Messages Chat Integration', () => {
    const mockChatService = {
        getMisGrupos: vi.fn(),
        getMensajes: vi.fn(),
        enviarMensajeAlGrupo: vi.fn()
    };

    it('should load chat list and send a message via ChatService', async () => {
        mockChatService.getMisGrupos.mockReturnValue(of([{ id: 1, nombre: 'Alice', ultimoMensaje: 'Hi' }]));
        mockChatService.getMensajes.mockReturnValue(of([{ id: 101, contenido: 'Hi', remitenteNombre: 'Alice' }]));
        mockChatService.enviarMensajeAlGrupo.mockReturnValue(of({ success: true }));

        await render(MessagesComponent, {
            providers: [
                { provide: ChatService, useValue: mockChatService }
            ]
        });

        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Alice'));

        const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
        fireEvent.input(input, { target: { value: 'Hello' } });
        fireEvent.click(screen.getByLabelText(/Enviar/i));

        expect(mockChatService.enviarMensajeAlGrupo).toHaveBeenCalled();
    });
});
