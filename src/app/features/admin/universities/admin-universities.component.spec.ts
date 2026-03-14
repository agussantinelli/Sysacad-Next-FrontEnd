import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUniversitiesComponent } from './admin-universities.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
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
});
