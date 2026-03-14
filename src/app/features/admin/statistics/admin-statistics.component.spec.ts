import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStatisticsComponent } from './admin-statistics.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of, throwError } from 'rxjs';
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

  it('should load filters and statistics on init', () => {
    const mockStats = {
        cantidadAprobadosExamen: 10,
        cantidadDesaprobadosExamen: 5,
        cantidadAusentesExamen: 2,
        cantidadRegulares: 20,
        cantidadPromocionados: 15,
        cantidadLibres: 5
    } as any;
    adminService.obtenerEstadisticas.and.returnValue(of(mockStats));
    
    component.ngOnInit();
    
    expect(adminService.getAllFacultades).toHaveBeenCalled();
    expect(adminService.getAllCarreras).toHaveBeenCalled();
    expect(adminService.obtenerEstadisticas).toHaveBeenCalled();
    
    expect(component.examChartData[0].value).toBe(10); // Aprobados
    expect(component.studentChartData[2].value).toBe(5); // Libres
  });

  it('should apply filters and reload stats', () => {
    component.selectedAnio = 2024;
    component.selectedFacultad = 'F1';
    component.selectedCarrera = 'C1';
    
    component.applyFilters();
    
    expect(adminService.obtenerEstadisticas).toHaveBeenCalledWith(2024, 'F1', 'C1');
  });

  it('should handle error when loading statistics', () => {
        adminService.obtenerEstadisticas.and.returnValue(throwError(() => new Error('Error')));
    
    component.loadStatistics();
    
    expect(alertService.error).toHaveBeenCalledWith('Error al cargar las estadísticas.');
    expect(component.isLoading).toBeFalse();
  });
});
