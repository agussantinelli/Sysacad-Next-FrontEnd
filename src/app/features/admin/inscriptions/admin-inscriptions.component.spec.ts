import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminInscriptionsComponent } from './admin-inscriptions.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminInscriptionsComponent', () => {
  let component: AdminInscriptionsComponent;
  let fixture: ComponentFixture<AdminInscriptionsComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', ['obtenerInscripciones', 'eliminarInscripcion']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminInscriptionsComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInscriptionsComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    adminService.obtenerInscripciones.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load inscriptions on init', () => {
    const mockInsc = [{ id: '1', nombre: 'A', apellido: 'B', nombreMateria: 'M1', fechaInscripcion: '2024-01-01' }] as any;
    adminService.obtenerInscripciones.and.returnValue(of(mockInsc));
    
    component.ngOnInit();
    
    expect(adminService.obtenerInscripciones).toHaveBeenCalled();
    expect(component.inscripciones).toEqual(mockInsc);
  });

  it('should sort data by column', () => {
    component.inscripciones = [
        { apellido: 'Z', nombre: 'A', nombreMateria: 'Math', fechaInscripcion: '2024-02-01' },
        { apellido: 'A', nombre: 'B', nombreMateria: 'Physics', fechaInscripcion: '2024-01-01' }
    ] as any;

    component.onSort('alumno');
    expect(component.inscripciones[0].apellido).toBe('A');

    component.onSort('alumno'); // Toggle desc
    expect(component.inscripciones[0].apellido).toBe('Z');
  });

  it('should delete inscription after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    adminService.eliminarInscripcion.and.returnValue(of(undefined));
    spyOn(component, 'loadInscriptions');

    const mockItem = { id: '1', nombre: 'Juan', apellido: 'Perez', nombreMateria: 'Math', tipo: 'CURSADA' } as any;
    component.deleteInscription(mockItem);

    expect(window.confirm).toHaveBeenCalled();
    expect(adminService.eliminarInscripcion).toHaveBeenCalledWith('1', 'CURSADA');
    expect(alertService.success).toHaveBeenCalled();
    expect(component.loadInscriptions).toHaveBeenCalled();
  });

  it('should navigate to create and profile', () => {
    const router = TestBed.inject(Router);
    component.goToCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/inscriptions/create']);

    component.goToProfile('U1');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/profile', 'U1']);
  });
});
