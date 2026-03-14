import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { ChatService } from '@core/services/chat.service';
import { AuthService } from '@core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MessagesComponent', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;
    let chatService: jasmine.SpyObj<ChatService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const chatSpy = jasmine.createSpyObj('ChatService', [
            'getGruposAlumno', 
            'getGruposProfesor', 
            'getMisGrupos', 
            'marcarLeido',
            'getMiembros',
            'getMensajes',
            'enviarMensajeAlGrupo'
        ]);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1', rol: 'ESTUDIANTE' } as any)
        });
        const activatedRouteSpy = {
            snapshot: { queryParamMap: { get: () => null } }
        };

        await TestBed.configureTestingModule({
            imports: [MessagesComponent, NoopAnimationsModule],
            providers: [
                { provide: ChatService, useValue: chatSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
        chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        chatService.getGruposAlumno.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load groups based on user role', () => {
        const mockGroups = [{ id: '1', nombre: 'Grupo 1', esVisible: true }] as any;
        chatService.getGruposAlumno.and.returnValue(of(mockGroups));
        
        fixture.detectChanges(); // ngOnInit loads groups
        
        expect(chatService.getGruposAlumno).toHaveBeenCalled();
        expect(component.conversations).toEqual(mockGroups);
    });

    it('should select conversation and load messages', () => {
        const mockGroup = { id: 'G1', nombre: 'G1' } as any;
        const mockMessages = [{ id: 'M1', contenido: 'Hola' }] as any;
        const mockMiembros = [{ idUsuario: '1', rol: 'ADMIN' }] as any;
        
        chatService.getMensajes.and.returnValue(of(mockMessages));
        chatService.getMiembros.and.returnValue(of(mockMiembros));
        chatService.marcarLeido.and.returnValue(of(undefined));
        
        component.currentUserId = '1';
        component.selectConversation(mockGroup);
        
        expect(component.selectedConversation).toBe(mockGroup);
        expect(chatService.getMensajes).toHaveBeenCalledWith('G1');
        expect(chatService.getMiembros).toHaveBeenCalledWith('G1');
        expect(component.canSend).toBeTrue();
        expect(component.messages).toEqual(mockMessages);
    });

    it('should send message successfully', () => {
        const mockGroup = { id: 'G1', nombre: 'G1', esVisible: false } as any;
        component.selectedConversation = mockGroup;
        component.canSend = true;
        
        const mockMsg = { id: 'M2', contenido: 'Test', fechaEnvio: '2024-03-14' } as any;
        chatService.enviarMensajeAlGrupo.and.returnValue(of(mockMsg));
        
        component.onSendMessage('Test');
        
        expect(chatService.enviarMensajeAlGrupo).toHaveBeenCalledWith('G1', 'Test');
        expect(component.messages).toContain(mockMsg);
        expect(mockGroup.esVisible).toBeTrue();
    });

    it('should filter active and inactive conversations', () => {
        component.conversations = [
            { id: '1', nombre: 'A', esVisible: true, fechaCreacion: '2024-01-01' },
            { id: '2', nombre: 'B', esVisible: false, fechaCreacion: '2024-01-01' }
        ] as any;
        
        expect(component.activeConversations.length).toBe(1);
        expect(component.inactiveConversations.length).toBe(1);
        expect(component.activeConversations[0].id).toBe('1');
    });
});
