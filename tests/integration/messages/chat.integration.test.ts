import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { MessagesComponent } from '../../../src/app/features/messages/messages.component';
import { ChatService } from '../../../src/app/core/services/chat.service';
import { of } from 'rxjs';

describe('Messages Chat Integration', () => {
    let mockChatService: jasmine.SpyObj<ChatService>;

    beforeEach(() => {
        mockChatService = jasmine.createSpyObj('ChatService', [
            'getMisGrupos',
            'getMensajes',
            'enviarMensajeAlGrupo'
        ]);
    });

    it('should load chat list and send a message via ChatService', async () => {
        mockChatService.getMisGrupos.and.returnValue(of([{ id: 1, nombre: 'Alice', ultimoMensaje: 'Hi' }] as any));
        mockChatService.getMensajes.and.returnValue(of([{ id: 101, contenido: 'Hi', remitenteNombre: 'Alice' }] as any));
        mockChatService.enviarMensajeAlGrupo.and.returnValue(of({ success: true } as any));

        await render(MessagesComponent, {
            providers: [
                { provide: ChatService, useValue: mockChatService }
            ]
        });

        await waitFor(() => expect(screen.getByText('Alice')).toBeTruthy());
        fireEvent.click(screen.getByText('Alice'));

        const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
        fireEvent.input(input, { target: { value: 'Hello' } });
        fireEvent.click(screen.getByLabelText(/Enviar/i));

        expect(mockChatService.enviarMensajeAlGrupo).toHaveBeenCalled();
    });
});
