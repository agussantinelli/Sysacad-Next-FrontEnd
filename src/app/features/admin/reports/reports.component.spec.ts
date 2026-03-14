import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { ReporteService } from '@core/services/reporte.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let reporteService: jasmine.SpyObj<ReporteService>;

  beforeEach(async () => {
    const reporteSpy = jasmine.createSpyObj('ReporteService', ['getCertificadosHistory']);

    await TestBed.configureTestingModule({
      imports: [ReportsComponent, NoopAnimationsModule],
      providers: [
        { provide: ReporteService, useValue: reporteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    reporteService = TestBed.inject(ReporteService) as jasmine.SpyObj<ReporteService>;

    reporteService.getCertificadosHistory.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load reports on init', () => {
    const mockReports = [
        { id: '1', nombre: 'Cert 1', fechaGeneracion: '2024-01-01' }
    ] as any;
    reporteService.getCertificadosHistory.and.returnValue(of(mockReports));
    
    component.ngOnInit();
    
    expect(reporteService.getCertificadosHistory).toHaveBeenCalled();
    expect(component.reports).toEqual(mockReports);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading reports', () => {
        reporteService.getCertificadosHistory.and.returnValue(throwError(() => new Error('Error')));
    
    component.loadReports();
    
    expect(component.error).toBe('No se pudo cargar el historial de reportes. Intente nuevamente.');
    expect(component.isLoading).toBeFalse();
  });
});
