import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCareersComponent } from './admin-careers.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminCareersComponent', () => {
  let component: AdminCareersComponent;
  let fixture: ComponentFixture<AdminCareersComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', ['getAllCarreras', 'crearCarrera', 'getPlanesDetallados', 'obtenerFacultades']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminCareersComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCareersComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    adminService.getAllCarreras.and.returnValue(of([]));
  });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load careers on init', () => {
        const mockCareers = [{ id: 1, nombre: 'Sistemas', alias: 'ISI' }] as any;
        adminService.getAllCarreras.and.returnValue(of(mockCareers));
        
        component.ngOnInit();
        
        expect(adminService.getAllCarreras).toHaveBeenCalled();
        expect(component.carreras).toEqual(mockCareers);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading careers', () => {
        adminService.getAllCarreras.and.returnValue(throwError(() => ({ error: 'Error' })));
        spyOn(console, 'error');
        
        component.loadCarreras();
        
        expect(alertService.error).toHaveBeenCalledWith('Error al cargar carreras');
        expect(component.isLoading).toBeFalse();
    });

    it('should open and close create modal', () => {
        component.openCreateModal();
        expect(component.showModal).toBeTrue();
        expect(component.newCarrera.nombre).toBe('');

        component.closeModal();
        expect(component.showModal).toBeFalse();
    });

    it('should not create career if invalid', () => {
        component.newCarrera = { nombre: '', alias: '', horasElectivasRequeridas: 0 };
        component.createCarrera();
        expect(adminService.crearCarrera).not.toHaveBeenCalled();
    });

    it('should create career successfully', () => {
        adminService.crearCarrera.and.returnValue(of({} as any));
        spyOn(component, 'loadCarreras');
        
        component.newCarrera = { nombre: 'Test', alias: 'T', horasElectivasRequeridas: 10 };
        component.showModal = true;
        
        component.createCarrera();
        
        expect(adminService.crearCarrera).toHaveBeenCalledWith(component.newCarrera);
        expect(alertService.success).toHaveBeenCalledWith('Carrera creada exitosamente');
        expect(component.showModal).toBeFalse();
        expect(component.loadCarreras).toHaveBeenCalled();
    });

    it('should show plans modal on viewPlans', () => {
        const mockPlans = [{ id: 1, anio: 2023, carreraId: 10 }] as any;
        adminService.getPlanesDetallados.and.returnValue(of(mockPlans));
        
        const mockCarrera = { id: 10, nombre: 'Sistemas' } as any;
        component.viewPlans(mockCarrera);
        
        expect(adminService.getPlanesDetallados).toHaveBeenCalledWith(10 as any);
        expect(component.selectedCarreraPlans).toEqual(mockPlans);
        expect(component.showPlansModal).toBeTrue();
    });

    it('should navigate to plan detail', () => {
        const mockPlan = { carreraId: 10, anio: 2023 } as any;
        component.goToPlanDetail(mockPlan);
        expect(router.navigate).toHaveBeenCalledWith(['/admin/carreras', 10, 'plan', 2023] as any);
    });
});
