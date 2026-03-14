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

    it('should load commissions and carreras on init', () => {
        const mockComms = [{ id: '1', nombre: 'A', idCarrera: 'C1', anio: 2024, nivel: 1 }] as any;
        const mockCarreras = [{ id: 'C1', nombre: 'ISI' }] as any;
        adminService.getAllComisiones.and.returnValue(of(mockComms));
        adminService.getAllCarreras.and.returnValue(of(mockCarreras));

        component.ngOnInit();

        expect(component.comisiones).toEqual(mockComms);
        expect(component.carreras).toEqual(mockCarreras);
    });

    it('should load salones when turno or anio changes', () => {
        component.newComision.turno = 'MAÑANA';
        component.newComision.anio = 2024;
        const mockSalones = [{ id: 'S1', nombre: 'Aula 101' }] as any;
        adminService.getSalonesDisponibles.and.returnValue(of(mockSalones));

        component.onTurnoOrAnioChange();

        expect(adminService.getSalonesDisponibles).toHaveBeenCalledWith('MAÑANA', 2024);
        expect(component.salones).toEqual(mockSalones);
    });

    it('should open and close create modal', () => {
        component.carreras = [{ id: 'C1', nombre: 'ISI' }] as any;
        component.openCreateModal();
        expect(component.showModal).toBeTrue();
        expect(component.newComision.idCarrera).toBe('C1');

        component.closeCreateModal();
        expect(component.showModal).toBeFalse();
    });

    it('should create comision successfully', () => {
        adminService.crearComision.and.returnValue(of({} as any));
        spyOn(component, 'loadComisiones');
        
        component.newComision = { nombre: 'Test', idCarrera: 'C1', anio: 2024, turno: 'TARDE', nivel: 1, idSalon: '', idsMaterias: [], idsProfesores: [] };
        component.createComision();

        expect(adminService.crearComision).toHaveBeenCalled();
        expect(alertService.success).toHaveBeenCalled();
        expect(component.showModal).toBeFalse();
    });

    it('should calculate total hours correctly', () => {
        component.scheduleList = [
            { dia: 'LUNES', horaDesde: '08:00', horaHasta: '10:00' }, // 2h
            { dia: 'MIÉRCOLES', horaDesde: '14:00', horaHasta: '15:30' } // 1.5h
        ];
        expect(component.calculateTotalHours()).toBe(3.5);
    });

    it('should validate schedules against subject hours', () => {
        component.selectedSubject = { horasCursado: 4 };
        component.scheduleList = [{ dia: 'LUNES', horaDesde: '08:00', horaHasta: '12:00' }];
        expect(component.validateSchedules()).toBeTrue();

        component.scheduleList = [{ dia: 'LUNES', horaDesde: '08:00', horaHasta: '11:00' }];
        expect(component.validateSchedules()).toBeFalse();
    });

    it('should search professors on step 2 to 3 transition', () => {
        component.selectedSubjectId = 'M1';
        component.selectedSubject = { horasCursado: 2 };
        component.scheduleList = [{ dia: 'LUNES', horaDesde: '08:00', horaHasta: '10:00' }];
        
        const mockProfs = [{ id: 'P1', nombre: 'Prof 1' }] as any;
        adminService.getProfesoresDisponibles.and.returnValue(of(mockProfs));

        component.goToStep3();

        expect(adminService.getProfesoresDisponibles).toHaveBeenCalled();
        expect(component.availableProfessors).toEqual(mockProfs);
        expect(component.assignStep).toBe('PROFESSORS');
    });

    it('should finalize assignment successfully', () => {
        adminService.asignarMateriaComision.and.returnValue(of({} as any));
        component.selectedComision = { id: 'COM1' } as any;
        component.selectedSubjectId = 'M1';
        component.selectedProfessorIds = ['P1'];
        component.scheduleList = [{ dia: 'LUNES', horaDesde: '08:00', horaHasta: '10:00' }];

        component.finalizeAssignment();

        expect(adminService.asignarMateriaComision).toHaveBeenCalledWith('COM1', jasmine.any(Object));
        expect(alertService.success).toHaveBeenCalled();
        expect(component.showAssignModal).toBeFalse();
    });
});
