import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

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

    it('should load user data from auth service and api on init', () => {
        const mockUser = { id: '1', nombre: 'Test' } as any;
        usuarioService.obtenerPorId.and.returnValue(of(mockUser));
        
        component.ngOnInit();
        
        expect(component.usuario?.id).toBe('1');
        expect(usuarioService.obtenerPorId).toHaveBeenCalledWith('1');
        expect(authService.updateUser).toHaveBeenCalledWith(mockUser);
    });

    it('should handle photo upload', () => {
        const mockFile = new File([''], 'photo.png');
        const mockUser = { id: '1' } as any;
        component.usuario = mockUser;
        
        usuarioService.subirFotoPerfil.and.returnValue(of('new-url'));
        usuarioService.obtenerPorId.and.returnValue(of(mockUser));
        
        component.handlePhotoUpload(mockFile);
        
        expect(usuarioService.subirFotoPerfil).toHaveBeenCalledWith('1', mockFile);
        expect(usuarioService.obtenerPorId).toHaveBeenCalledWith('1');
        expect(authService.updateUser).toHaveBeenCalled();
        expect(component.isUploadingPhoto).toBeFalse();
    });

    it('should navigate to edit and change password', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        
        component.navigateToEdit();
        expect(router.navigate).toHaveBeenCalledWith(['/profile/edit']);
        
        component.navigateToChangePassword();
        expect(router.navigate).toHaveBeenCalledWith(['/profile/change-password']);
    });

    it('should check if profile is complete', () => {
        component.usuario = { 
            dni: '1', nombre: 'A', apellido: 'B', mail: 'a@a.com', 
            fechaNacimiento: '2000-01-01', genero: 'M', telefono: '1', 
            direccion: 'X', ciudad: 'Y' 
        } as any;
        expect(component.isProfileComplete).toBeTrue();
        
        (component.usuario as any).dni = null;
        expect(component.isProfileComplete).toBeFalse();
    });
});
