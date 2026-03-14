import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { AvisoService } from '@core/services/aviso.service';
import { ChatService } from '@core/services/chat.service';
import { of, Subject } from 'rxjs';
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
});
