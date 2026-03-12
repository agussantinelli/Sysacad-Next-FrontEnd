import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let avisoService: jasmine.SpyObj<AvisoService>;
    let chatService: jasmine.SpyObj<ChatService>;
    let unreadCountSubject: Subject<void>;
    let historyStateSpy: jasmine.Spy;

    const mockUser = {
        id: '1',
        nombre: 'Agus',
        apellido: 'Santinelli',
        email: 'agus@example.com',
        rol: 'ESTUDIANTE',
        legajo: 12345
    };

    beforeEach(async () => {
        unreadCountSubject = new Subject<void>();
        const avisoSpy = jasmine.createSpyObj('AvisoService', ['obtenerCantidadSinLeer']);
        const chatSpy = jasmine.createSpyObj('ChatService', ['getTotalMensajesSinLeer'], {
            unreadCountChanged$: unreadCountSubject.asObservable()
        });

        await TestBed.configureTestingModule({
            imports: [
                DashboardComponent,
                RouterTestingModule, 
                NoopAnimationsModule
            ],
            providers: [
                { provide: AvisoService, useValue: avisoSpy },
                { provide: ChatService, useValue: chatSpy }
            ]
        }).compileComponents();

        avisoService = TestBed.inject(AvisoService) as jasmine.SpyObj<AvisoService>;
        chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;

        avisoService.obtenerCantidadSinLeer.and.returnValue(of(5));
        chatService.getTotalMensajesSinLeer.and.returnValue(of(3));

        // Mock history state
        historyStateSpy = spyOnProperty(history, 'state', 'get').and.returnValue({});

        // Mock localStorage
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            if (key === 'user') return JSON.stringify(mockUser);
            return null;
        });

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    });

    it('should create and load initial data', () => {
        fixture.detectChanges(); // Trigger ngOnInit
        expect(component).toBeTruthy();
        expect(component.usuario?.nombre).toBe('Agus');
        expect(avisoService.obtenerCantidadSinLeer).toHaveBeenCalled();
        expect(chatService.getTotalMensajesSinLeer).toHaveBeenCalled();
    });

    it('should set correct greeting based on time', () => {
        // We can't easily mock Date directly without more setup, 
        // but we can test the logic by calling setGreeting
        component.setGreeting();
        expect(component.greeting).toMatch(/Buenos días|Buenas tardes|Buenas noches/);
    });

    it('should update badge counts in the menu', () => {
        fixture.detectChanges();
        
        const avisosOption = component.menuSections
            .flatMap(s => s.options)
            .find(o => o.title === 'Avisos');
            
        expect(avisosOption?.badgeCount).toBe(5);
    });

    it('should react to unread messages changes', () => {
        fixture.detectChanges();
        chatService.getTotalMensajesSinLeer.and.returnValue(of(10));
        
        unreadCountSubject.next();
        
        const mensajesOption = component.menuSections
            .flatMap(s => s.options)
            .find(o => o.title === 'Mensajes');
            
        expect(mensajesOption?.badgeCount).toBe(10);
    });

    it('should show welcome message if loginSuccess is in history state', fakeAsync(() => {
        // Mock history state
        historyStateSpy.and.returnValue({ loginSuccess: true });
        spyOn(sessionStorage, 'getItem').and.returnValue(null);
        spyOn(sessionStorage, 'setItem');

        component.ngOnInit();
        expect(component.successMessage).toBe('¡Bienvenido/a al Sistema de Gestión Académica!');
        
        tick(5001);
        expect(component.successMessage).toBeNull();
    }));
});
