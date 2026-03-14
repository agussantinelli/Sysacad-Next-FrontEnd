import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let usuarioService: jasmine.SpyObj<UsuarioService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['obtenerPorId', 'subirFotoPerfil']);
        const authSpy = jasmine.createSpyObj('AuthService', ['updateUser'], {
            currentUser$: of({ id: '1' } as any)
        });

        await TestBed.configureTestingModule({
            imports: [ProfileComponent, NoopAnimationsModule, RouterTestingModule],
            providers: [
                { provide: UsuarioService, useValue: usuarioSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        // Mock localStorage
        const mockUser = { id: '1' };
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        usuarioService.obtenerPorId.and.returnValue(of({ id: '1' } as any));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
