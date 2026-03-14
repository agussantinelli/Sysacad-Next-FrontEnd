import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HealthService } from '@core/services/health.service';
import { AuthService } from '@core/services/auth.service';
import { ChatService } from '@core/services/chat.service';
import { AvisoService } from '@core/services/aviso.service';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { ThemeService } from '@core/services/theme.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let healthServiceSpy: jasmine.SpyObj<HealthService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;
    let avisoServiceSpy: jasmine.SpyObj<AvisoService>;
    let routerSpy: any;
    let routerEventsSubject: Subject<any>;
    let currentUserSubject: BehaviorSubject<any>;

    beforeEach(async () => {
        routerEventsSubject = new Subject<any>();
        currentUserSubject = new BehaviorSubject<any>(null);

        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: currentUserSubject.asObservable()
        });
        const healthSpy = jasmine.createSpyObj('HealthService', ['startMonitoring', 'stopMonitoring']);
        const chatSpy = jasmine.createSpyObj('ChatService', ['getTotalMensajesSinLeer'], {
            unreadCountChanged$: of(void 0)
        });
        const avisoSpy = jasmine.createSpyObj('AvisoService', ['obtenerCantidadSinLeer']);
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);
        routerSpy = {
            navigate: jasmine.createSpy('navigate'),
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('/'),
            events: routerEventsSubject.asObservable(),
            url: '/'
        };

        await TestBed.configureTestingModule({
            imports: [AppComponent, NoopAnimationsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: HealthService, useValue: healthSpy },
                { provide: ChatService, useValue: chatSpy },
                { provide: AvisoService, useValue: avisoSpy },
                { provide: ThemeService, useValue: themeSpy },
                { provide: Router, useValue: routerSpy },
                { 
                    provide: ActivatedRoute, 
                    useValue: { 
                        snapshot: { params: {} }, 
                        params: of({}), 
                        queryParams: of({}) 
                    } 
                }
            ]
        }).compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        healthServiceSpy = TestBed.inject(HealthService) as jasmine.SpyObj<HealthService>;
        chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
        avisoServiceSpy = TestBed.inject(AvisoService) as jasmine.SpyObj<AvisoService>;
        
        avisoServiceSpy.obtenerCantidadSinLeer.and.returnValue(of(0));

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should create the app', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it(`should have the 'Sysacad-Next-FrontEnd' title`, () => {
        expect(component.title).toEqual('Sysacad-Next-FrontEnd');
    });

    it('should show navbar on non-excluded routes', () => {
        routerSpy.url = '/dashboard';
        routerEventsSubject.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
        fixture.detectChanges();
        expect(component.showNavbar).toBeTrue();
    });

    it('should hide navbar on excluded routes', () => {
        routerSpy.url = '/login';
        routerEventsSubject.next(new NavigationEnd(1, '/login', '/login'));
        fixture.detectChanges();
        expect(component.showNavbar).toBeFalse();
    });

    it('should start monitoring and load unread count when user logs in', () => {
        const mockUser = { id: '1', nombre: 'Test' };
        chatServiceSpy.getTotalMensajesSinLeer.and.returnValue(of(5));
        
        fixture.detectChanges(); // Triggers ngOnInit
        currentUserSubject.next(mockUser);
        
        expect(healthServiceSpy.startMonitoring).toHaveBeenCalled();
        expect(chatServiceSpy.getTotalMensajesSinLeer).toHaveBeenCalled();
        expect(component.unreadMessagesCount).toBe(5);
    });
});
