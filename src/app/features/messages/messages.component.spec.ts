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
            'getMensajes'
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
});
