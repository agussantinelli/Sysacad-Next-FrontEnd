import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStatisticsComponent } from './admin-statistics.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminStatisticsComponent', () => {
  let component: AdminStatisticsComponent;
  let fixture: ComponentFixture<AdminStatisticsComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', [
      'getAllFacultades', 
      'getAllCarreras', 
      'obtenerEstadisticas'
    ]);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [AdminStatisticsComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStatisticsComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    adminService.getAllFacultades.and.returnValue(of([]));
    adminService.getAllCarreras.and.returnValue(of([]));
    adminService.obtenerEstadisticas.and.returnValue(of({
      cantidadAprobadosExamen: 0,
      cantidadDesaprobadosExamen: 0,
      cantidadAusentesExamen: 0,
      cantidadRegulares: 0,
      cantidadPromocionados: 0,
      cantidadLibres: 0
    } as any));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
