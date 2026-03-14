import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserProfileComponent } from './admin-user-profile.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AlertService } from '@core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
});
