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
});
