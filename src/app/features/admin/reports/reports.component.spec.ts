import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { ReporteService } from '@core/services/reporte.service';
import { of } from 'rxjs';
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
});
