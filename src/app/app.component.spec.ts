import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { HealthService } from '@core/services/health.service';
import { AuthService } from '@core/services/auth.service';
import { ChatService } from '@core/services/chat.service';
import { of, Subject } from 'rxjs';
import { ThemeService } from '@core/services/theme.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let healthServiceSpy: jasmine.SpyObj<HealthService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let routerEventsSubject: Subject<any>;

    beforeEach(async () => {
        routerEventsSubject = new Subject<any>();
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of(null)
        });
        const healthSpy = jasmine.createSpyObj('HealthService', ['startMonitoring', 'stopMonitoring']);
        const chatSpy = jasmine.createSpyObj('ChatService', ['getTotalMensajesSinLeer'], {
            unreadCountChanged$: of(void 0)
        });
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);
        const rSpy = jasmine.createSpyObj('Router', ['navigate'], {
            events: routerEventsSubject.asObservable(),
            url: '/'
        });

        await TestBed.configureTestingModule({
            imports: [AppComponent, NoopAnimationsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: HealthService, useValue: healthSpy },
                { provide: ChatService, useValue: chatSpy },
                { provide: ThemeService, useValue: themeSpy },
                { provide: Router, useValue: rSpy }
            ]
        }).compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        healthServiceSpy = TestBed.inject(HealthService) as jasmine.SpyObj<HealthService>;
        chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

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
        (routerSpy as any).url = '/dashboard';
        routerEventsSubject.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
        fixture.detectChanges();
        expect(component.showNavbar).toBeTrue();
    });

    it('should hide navbar on excluded routes', () => {
        (routerSpy as any).url = '/login';
        routerEventsSubject.next(new NavigationEnd(1, '/login', '/login'));
        fixture.detectChanges();
        expect(component.showNavbar).toBeFalse();
    });

    it('should start monitoring and load unread count when user logs in', () => {
        const mockUser = { id: '1', nombre: 'Test' };
        authServiceSpy.currentUser$ = of(mockUser as any);
        chatServiceSpy.getTotalMensajesSinLeer.and.returnValue(of(5));
        
        component.ngOnInit();
        fixture.detectChanges();

        expect(healthServiceSpy.startMonitoring).toHaveBeenCalled();
        expect(chatServiceSpy.getTotalMensajesSinLeer).toHaveBeenCalled();
        expect(component.unreadMessagesCount).toBe(5);
    });
});
