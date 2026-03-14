import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCommissionsComponent } from './admin-commissions.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminCommissionsComponent', () => {
  let component: AdminCommissionsComponent;
  let fixture: ComponentFixture<AdminCommissionsComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', [
      'getAllComisiones', 
      'getAllCarreras', 
      'getSalonesDisponibles', 
      'crearComision',
      'getPlanDetalle',
      'getProfesoresDisponibles',
      'asignarMateriaComision'
    ]);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [AdminCommissionsComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCommissionsComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    adminService.getAllComisiones.and.returnValue(of([]));
    adminService.getAllCarreras.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
