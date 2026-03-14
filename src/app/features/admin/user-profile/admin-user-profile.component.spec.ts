import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserProfileComponent } from './admin-user-profile.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AlertService } from '@core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EstadoUsuario } from '@core/models/usuario.models';

describe('AdminUserProfileComponent', () => {
  let component: AdminUserProfileComponent;
  let fixture: ComponentFixture<AdminUserProfileComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['obtenerPorId', 'cambiarEstado']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = {
      snapshot: { paramMap: { get: (key: string) => '1' } }
    };

    await TestBed.configureTestingModule({
      imports: [AdminUserProfileComponent, NoopAnimationsModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserProfileComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    usuarioService.obtenerPorId.and.returnValue(of({ id: '1', nombre: 'Test', apellido: 'User', estado: 'ACTIVO' } as any));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    const mockUser = { id: '1', nombre: 'Juan', apellido: 'Perez', estado: 'ACTIVO', nroDocumento: '123' } as any;
    usuarioService.obtenerPorId.and.returnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(usuarioService.obtenerPorId).toHaveBeenCalledWith('1');
    expect(component.usuario).toEqual(mockUser);
  });

  it('should navigate to edit user', () => {
    component.usuario = { id: '1' } as any;
    component.editUser();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/admin/users/edit', '1']);
  });

  it('should toggle user state and confirm', () => {
    component.usuario = { id: '1', nombre: 'Juan', apellido: 'Perez', estado: 'ACTIVO' } as any;
    
    component.toggleState();
    expect(component.showModal).toBeTrue();
    expect(component.pendingNewState).toEqual(EstadoUsuario.INACTIVO);

    usuarioService.cambiarEstado.and.returnValue(of({ id: '1', estado: EstadoUsuario.INACTIVO } as any));
    component.onModalConfirm();
    
    expect(usuarioService.cambiarEstado).toHaveBeenCalledWith('1', EstadoUsuario.INACTIVO);
    expect(alertService.success).toHaveBeenCalled();
    expect(component.usuario?.estado).toEqual(EstadoUsuario.INACTIVO);
    expect(component.showModal).toBeFalse();
  });

  it('should handle error when changing status', () => {
    component.usuario = { id: '1', estado: EstadoUsuario.ACTIVO } as any;
    component.pendingNewState = EstadoUsuario.INACTIVO;
    usuarioService.cambiarEstado.and.returnValue(throwError(() => new Error('Error')));
    
    component.onModalConfirm();
    expect(alertService.error).toHaveBeenCalledWith('Error al cambiar el estado del usuario.');
    expect(component.showModal).toBeFalse();
  });
});
