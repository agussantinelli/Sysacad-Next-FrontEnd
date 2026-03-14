import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EstadoUsuario } from '@core/models/usuario.models';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['obtenerTodos', 'cambiarEstado']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UsersComponent, NoopAnimationsModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    usuarioService.obtenerTodos.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

    it('should load users on init', () => {
        const mockUsers = [{ id: '1', nombre: 'Juan', email: 'j@t.com' }] as any;
        usuarioService.obtenerTodos.and.returnValue(of(mockUsers));
        
        component.ngOnInit();
        
        expect(usuarioService.obtenerTodos).toHaveBeenCalled();
        expect(component.usuarios).toEqual(mockUsers);
        expect(component.isLoading).toBeFalse();
    });

    it('should navigate to create', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        component.goToCreate();
        expect(router.navigate).toHaveBeenCalledWith(['/admin/users/create']);
    });

    it('should navigate to edit user', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        component.editUser({ id: '123' } as any);
        expect(router.navigate).toHaveBeenCalledWith(['/admin/users/edit', '123']);
    });

    it('should navigate to profile', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        component.goToProfile({ id: '456' } as any);
        expect(router.navigate).toHaveBeenCalledWith(['/admin/profile', '456']);
    });

    it('should toggle user state successfully', () => {
        const mockUser = { id: '1', estado: EstadoUsuario.ACTIVO } as any;
        const updatedUser = { id: '1', estado: EstadoUsuario.INACTIVO } as any;
        usuarioService.cambiarEstado.and.returnValue(of(updatedUser));
        
        component.toggleState(mockUser);
        
        expect(usuarioService.cambiarEstado).toHaveBeenCalledWith('1', EstadoUsuario.INACTIVO);
        expect(mockUser.estado).toBe(EstadoUsuario.INACTIVO);
        expect(alertService.success).toHaveBeenCalled();
    });

    it('should handle error when toggling state', () => {
        usuarioService.cambiarEstado.and.returnValue(throwError(() => new Error('Error')));
        
        component.toggleState({ id: '1', estado: 'ACTIVO' } as any);
        
        expect(alertService.error).toHaveBeenCalled();
    });

    it('should return correct profile image URL', () => {
        expect(component.getProfileImageUrl('')).toBe('');
        expect(component.getProfileImageUrl('http://x.com/a.jpg')).toBe('http://x.com/a.jpg');
        expect(component.getProfileImageUrl('img.jpg')).toBe('http://localhost:8080/img.jpg');
        expect(component.getProfileImageUrl('/img.jpg')).toBe('http://localhost:8080/img.jpg');
    });
});
