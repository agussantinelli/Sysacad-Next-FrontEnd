import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUniversitiesComponent } from './admin-universities.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminUniversitiesComponent', () => {
  let component: AdminUniversitiesComponent;
  let fixture: ComponentFixture<AdminUniversitiesComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', [
      'getCarrerasSimples', 
      'getAllFacultades', 
      'asociarCarreraFacultad', 
      'createFacultad',
      'deleteFacultad'
    ]);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [AdminUniversitiesComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUniversitiesComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    adminService.getCarrerasSimples.and.returnValue(of([]));
    adminService.getAllFacultades.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    const mockFacs = [{ id: '1', ciudad: 'Rosario' }] as any;
    const mockCareers = [{ id: 'C1', nombre: 'Sistemas' }] as any;
    
    adminService.getAllFacultades.and.returnValue(of(mockFacs));
    adminService.getCarrerasSimples.and.returnValue(of(mockCareers));
    
    component.ngOnInit();
    
    expect(adminService.getAllFacultades).toHaveBeenCalled();
    expect(adminService.getCarrerasSimples).toHaveBeenCalled();
    expect(component.facultades).toEqual(mockFacs);
    expect(component.carrerasSimples).toEqual(mockCareers);
  });

  it('should create new faculty', () => {
    adminService.createFacultad.and.returnValue(of(undefined));
    spyOn(component, 'loadFacultades');
    
    component.newFacultad = { ciudad: 'Cordoba', provincia: 'Cordoba' };
    component.create();
    
    expect(adminService.createFacultad).toHaveBeenCalledWith({ ciudad: 'Cordoba', provincia: 'Cordoba' });
    expect(alertService.success).toHaveBeenCalledWith('Universidad creada correctamente');
    expect(component.loadFacultades).toHaveBeenCalled();
  });

  it('should associate career to faculty', () => {
    adminService.asociarCarreraFacultad.and.returnValue(of(undefined));
    spyOn(component, 'loadFacultades');
    
    component.selectedFacultadId = 'F1';
    component.selectedCarreraId = 'C1';
    component.asociarCarrera();
    
    expect(adminService.asociarCarreraFacultad).toHaveBeenCalledWith('C1', 'F1');
    expect(alertService.success).toHaveBeenCalledWith('Carrera asociada exitosamente');
    expect(component.loadFacultades).toHaveBeenCalled();
  });

  it('should delete faculty after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    adminService.deleteFacultad.and.returnValue(of(undefined));
    spyOn(component, 'loadFacultades');
    
    const mockFac = { id: 'F1', ciudad: 'Santa Fe' } as any;
    component.delete(mockFac);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(adminService.deleteFacultad).toHaveBeenCalledWith('F1');
    expect(alertService.success).toHaveBeenCalledWith('Universidad eliminada');
  });

  it('should handle error when creating faculty', () => {
        adminService.createFacultad.and.returnValue(throwError(() => ({ response: { data: { message: 'Failed' } } })));
    
    component.create();
    expect(alertService.error).toHaveBeenCalledWith('Failed');
  });
});
