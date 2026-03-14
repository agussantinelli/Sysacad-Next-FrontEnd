import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async () => {
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode', 'toggleTheme']);
        const authSpy = jasmine.createSpyObj('AuthService', ['logout'], {
            currentUser$: of({ rol: 'ESTUDIANTE' } as any)
        });
        const avisoSpy = jasmine.createSpyObj('AvisoService', ['obtenerCantidadSinLeer']);
        const chatSpy = jasmine.createSpyObj('ChatService', ['getTotalMensajesSinLeer'], {
            unreadCountChanged$: new Subject<void>().asObservable()
        });

        await TestBed.configureTestingModule({
            imports: [NavbarComponent, NoopAnimationsModule, RouterTestingModule],
            providers: [
                { provide: ThemeService, useValue: themeSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: AvisoService, useValue: avisoSpy },
                { provide: ChatService, useValue: chatSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        
        avisoSpy.obtenerCantidadSinLeer.and.returnValue(of(0));
        chatSpy.getTotalMensajesSinLeer.and.returnValue(of(0));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should toggle dropdown and reset activeSection', () => {
        component.activeSection = 'Inscripciones';
        component.toggleDropdown();
        expect(component.isDropdownOpen).toBeTrue();
        expect(component.activeSection).toBeNull();

        component.toggleDropdown();
        expect(component.isDropdownOpen).toBeFalse();
    });

    it('should set active section and close dropdown', () => {
        component.isDropdownOpen = true;
        component.setActiveSection('Consultas');
        expect(component.activeSection).toBe('Consultas');
        expect(component.isDropdownOpen).toBeFalse();

        component.setActiveSection('Consultas');
        expect(component.activeSection).toBeNull();
    });

    it('should close all on closeAll()', () => {
        component.isDropdownOpen = true;
        component.activeSection = 'Comunicación';
        component.closeAll();
        expect(component.isDropdownOpen).toBeFalse();
        expect(component.activeSection).toBeNull();
    });

    it('should update badge count for ESTUDIANTE', () => {
        component.usuario = { rol: 'ESTUDIANTE' } as any;
        component.updateBadgeCount('Avisos', 5);
        const avisosOpt = component.menuSections.find(s => s.title === 'Comunicación')
            ?.options.find(o => o.title === 'Avisos');
        expect(avisosOpt?.badgeCount).toBe(5);
    });

    it('should update badge count for PROFESOR', () => {
        component.usuario = { rol: 'PROFESOR' } as any;
        component.updateBadgeCount('Mensajes', 10);
        const mensajesOpt = component.professorSections.find(s => s.title === 'Comunicación')
            ?.options.find(o => o.title === 'Mensajes');
        expect(mensajesOpt?.badgeCount).toBe(10);
    });

    it('should return correct profile image URL', () => {
        expect(component.getProfileImageUrl('')).toBe('');
        expect(component.getProfileImageUrl('http://external.com/img.jpg')).toBe('http://external.com/img.jpg');
        expect(component.getProfileImageUrl('uploads/user.jpg')).toBe('http://localhost:8080/uploads/user.jpg');
        expect(component.getProfileImageUrl('/uploads/user.jpg')).toBe('http://localhost:8080/uploads/user.jpg');
    });

    it('should call authService.logout on logout()', () => {
        const authService = TestBed.inject(AuthService);
        component.logout();
        expect(authService.logout).toHaveBeenCalled();
    });

    it('should load counts on init if user exists', () => {
        spyOn(component, 'loadUnreadNotices');
        spyOn(component, 'loadUnreadMessages');
        
        // currentUser$ already emits ESTUDIANTE from beforeEach
        component.ngOnInit();
        
        expect(component.loadUnreadNotices).toHaveBeenCalled();
        expect(component.loadUnreadMessages).toHaveBeenCalled();
    });

    it('should return dark mode logo when theme is dark', () => {
        const themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
        themeService.isDarkMode.and.returnValue(true);
        expect(component.logoPath).toBe('/logo-utn-dark-mode.png');
    });

    it('should return light mode logo when theme is light', () => {
        const themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
        themeService.isDarkMode.and.returnValue(false);
        expect(component.logoPath).toBe('/logo-utn-light-mode.png');
    });

    it('should update badge count for ADMIN', () => {
        component.usuario = { rol: 'ADMIN' } as any;
        component.updateBadgeCount('Avisos', 3);
        const avisosOpt = component.adminSections.find(s => s.title === 'Trámites')
            ?.options.find(o => o.title === 'Avisos');
        expect(avisosOpt?.badgeCount).toBe(3);
    });

    it('should handle missing option in updateBadgeCount', () => {
        component.usuario = { rol: 'ESTUDIANTE' } as any;
        // Should not throw
        component.updateBadgeCount('NonExistentOption', 10);
        expect(true).toBeTrue();
    });

    it('should not load counts if user is null', () => {
        // Use a BehaviorSubject to control emissions
        const userSubject = new BehaviorSubject<any>(null);
        const authService = TestBed.inject(AuthService) as any;
        // In the setup, currentUser$ was a getter or a property. Let's force it to our subject.
        Object.defineProperty(authService, 'currentUser$', { value: userSubject.asObservable(), writable: true });
        
        spyOn(component, 'loadUnreadNotices');
        spyOn(component, 'loadUnreadMessages');
        
        component.ngOnInit();
        
        expect(component.loadUnreadNotices).not.toHaveBeenCalled();
        expect(component.loadUnreadMessages).not.toHaveBeenCalled();
    });

    it('should react to unreadCountChanged$ changes', () => {
        // chatSpy unreadCountChanged$ is a Subject in the setup
        const chatService = TestBed.inject(ChatService) as any;
        const unreadSubject = new Subject<void>();
        chatService.unreadCountChanged$ = unreadSubject.asObservable();
        
        spyOn(component, 'loadUnreadMessages');
        component.ngOnInit();
        
        unreadSubject.next();
        expect(component.loadUnreadMessages).toHaveBeenCalled();
    });
});
