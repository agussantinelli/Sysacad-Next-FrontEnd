import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPlanDetailComponent } from './plan-detail.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminPlanDetailComponent', () => {
  let component: AdminPlanDetailComponent;
  let fixture: ComponentFixture<AdminPlanDetailComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', ['getAllCarreras', 'getPlanDetalle']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = {
      paramMap: of({ get: (key: string) => key === 'carreraId' ? '1' : '2023' })
    };

    await TestBed.configureTestingModule({
      imports: [AdminPlanDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPlanDetailComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    adminService.getAllCarreras.and.returnValue(of([]));
    adminService.getPlanDetalle.and.returnValue(of({ nombre: 'Plan 2023', materias: [] } as any));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load career and plan data on init', () => {
    const mockCareers = [{ id: '1', nombre: 'Sistemas' }] as any;
    const mockPlan = { 
        nombre: 'Plan 2023', 
        materias: [
            { idMateria: 'M1', nombre: 'Math', nivel: 1 },
            { idMateria: 'M2', nombre: 'Physics', nivel: 2 }
        ] 
    } as any;
    
    adminService.getAllCarreras.and.returnValue(of(mockCareers));
    adminService.getPlanDetalle.and.returnValue(of(mockPlan));
    
    component.ngOnInit();
    
    expect(adminService.getPlanDetalle).toHaveBeenCalledWith('1', 2023);
    expect(component.careerName).toBe('Sistemas');
    expect(component.pageTitle).toBe('Sistemas - Plan 2023');
    expect(component.years).toEqual([1, 2]);
    expect(component.groupedMaterias[1][0].nombre).toBe('Math');
  });

  it('should handle error when loading plan', () => {
    adminService.getPlanDetalle.and.returnValue(throwError(() => new Error('Error')));
    
    component.loadPlan();
    
    expect(alertService.error).toHaveBeenCalledWith('Error al cargar detalle del plan');
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate back on goBack', () => {
    const router = TestBed.inject(Router);
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/careers']);
  });
});
