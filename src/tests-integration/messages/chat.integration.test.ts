/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { MessagesComponent } from '@features/messages/messages.component';
import { ChatService } from '@core/services/chat.service';
import { AuthService } from '@core/services/auth.service';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('Messages Chat Integration', () => {
    let mockChatService: jasmine.SpyObj<ChatService>;
    let mockAuthService: any;

    beforeEach(() => {
        mockChatService = jasmine.createSpyObj('ChatService', [
            'getMisGrupos',
            'getGruposAlumno',
            'getGruposProfesor',
            'getMensajes',
            'enviarMensajeAlGrupo',
            'marcarLeido',
            'getMiembros',
            'getTotalMensajesSinLeer'
        ]);
        
        mockAuthService = {
            currentUser$: of({ id: 'u1', nombre: 'Agustin', rol: 'ADMIN' })
        };
        (mockChatService as any).unreadCountChanged$ = new BehaviorSubject(0);
        
        mockChatService.marcarLeido.and.returnValue(of(void 0));
        mockChatService.getMiembros.and.returnValue(of([{ idUsuario: 'u1', rol: 'ADMIN' }] as any));
    });

    it('should load chat list and send a message via ChatService', async () => {
        mockChatService.getMisGrupos.and.returnValue(of([{ 
            id: 'g1', 
            nombre: 'Grupo Test', 
            esVisible: true, 
            horaUltimoMensaje: new Date(),
            idComision: 'c1',
            idMateria: 'm1'
        }] as any));
        
        mockChatService.getMensajes.and.returnValue(of([
            { id: 'm1', contenido: 'Hola logic', nombreRemitente: 'Alice', apellidoRemitente: '', fechaEnvio: new Date() }
        ] as any));
        
        mockChatService.enviarMensajeAlGrupo.and.returnValue(of({ 
            id: 'm2', 
            contenido: 'Hello', 
            nombreRemitente: 'Agustin', 
            apellidoRemitente: '', 
            fechaEnvio: new Date() 
        } as any));

        await render(MessagesComponent, {
            providers: [
                { provide: ChatService, useValue: mockChatService },
                { provide: AuthService, useValue: mockAuthService },
                { 
                    provide: ActivatedRoute, 
                    useValue: { 
                        snapshot: { queryParamMap: { get: () => null } } 
                    } 
                }
            ]
        });

        await waitFor(() => expect(screen.getByText('Grupo Test')).toBeTruthy());
        fireEvent.click(screen.getByText('Grupo Test'));

        const input = await screen.findByPlaceholderText(/Escribe un mensaje/i);
        fireEvent.input(input, { target: { value: 'Hello' } });
        
        const sendBtn = screen.getByLabelText(/Enviar/i);
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(mockChatService.enviarMensajeAlGrupo).toHaveBeenCalled();
        });
    });
});
