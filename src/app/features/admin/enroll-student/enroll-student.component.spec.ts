import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollStudentComponent } from './enroll-student.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EnrollStudentComponent', () => {
  let component: EnrollStudentComponent;
  let fixture: ComponentFixture<EnrollStudentComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', [
      'obtenerFacultades', 
      'buscarUsuarios', 
      'obtenerCarreras', 
      'obtenerPlanes',
      'matricular'
    ]);
    const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EnrollStudentComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollStudentComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    adminService.obtenerFacultades.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load faculties on init', () => {
    const mockFacs = [{ id: 'F1', nombre: 'UTN' }] as any;
    adminService.obtenerFacultades.and.returnValue(of(mockFacs));
    
    component.ngOnInit();
    
    expect(adminService.obtenerFacultades).toHaveBeenCalled();
    expect(component.facultades).toEqual(mockFacs);
  });

  it('should search student by legajo', () => {
    const mockStudents = [
        { id: '1', nroAlumno: 123, rol: 'estudiante', nombre: 'Juan' },
        { id: '2', nroAlumno: 456, rol: 'admin', nombre: 'Pedro' }
    ] as any;
    adminService.buscarUsuarios.and.returnValue(of(mockStudents));
    
    component.legajoQuery = '123';
    component.searchStudent();
    
    expect(adminService.buscarUsuarios).toHaveBeenCalledWith('123');
    expect(component.foundStudents.length).toBe(1); // Only students
    expect(component.foundStudents[0].id).toBe('1');
  });

  it('should load careers and plans on selection change', () => {
    const mockCareers = [{ id: 'C1', nombre: 'Sistemas' }] as any;
    const mockPlanes = [{ nroPlan: 2023, esVigente: true }] as any;
    
    adminService.obtenerCarreras.and.returnValue(of(mockCareers));
    adminService.obtenerPlanes.and.returnValue(of(mockPlanes));
    
    component.selectedFacultadId = 'F1';
    component.onFacultadChange();
    expect(adminService.obtenerCarreras).toHaveBeenCalledWith('F1');
    expect(component.carreras).toEqual(mockCareers);

    component.selectedCarreraId = 'C1';
    component.onCarreraChange();
    expect(adminService.obtenerPlanes).toHaveBeenCalledWith('C1');
    expect(component.planes).toEqual(mockPlanes);
  });

  it('should matricular successfully', () => {
    adminService.matricular.and.returnValue(of(undefined));
    spyOn(component, 'resetForm');
    
    component.selectedStudent = { id: 'S1' } as any;
    component.selectedFacultadId = 'F1';
    component.selectedCarreraId = 'C1';
    component.selectedPlanNro = 2023;
    
    component.onSubmit();
    
    expect(adminService.matricular).toHaveBeenCalled();
    expect(alertService.success).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should show info message if no students found', () => {
    adminService.buscarUsuarios.and.returnValue(of([]));
    component.legajoQuery = '999';
    component.searchStudent();
    expect(alertService.info).toHaveBeenCalledWith('No se encontraron alumnos con ese legajo.');
  });
});
