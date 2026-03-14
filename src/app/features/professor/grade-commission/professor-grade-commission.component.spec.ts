import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorGradeCommissionComponent } from './professor-grade-commission.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfessorGradeCommissionComponent', () => {
    let component: ProfessorGradeCommissionComponent;
    let fixture: ComponentFixture<ProfessorGradeCommissionComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getInscriptosComision', 'cargarNotasComision']);
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'info']);
        const activatedRouteSpy = {
            paramMap: of({ get: (key: string) => (key === 'idComision' ? '1' : '1') })
        };
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ProfessorGradeCommissionComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: AlertService, useValue: alertSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorGradeCommissionComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getInscriptosComision.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load students and map concepts on init', () => {
        const mockStudents = [{
            idInscripcion: '1', nombre: 'A', apellido: 'B', legajo: 123,
            estado: 'CURSANDO',
            calificaciones: [{ concepto: 'Parcial 1', nota: 8 }]
        }] as any;
        professorService.getInscriptosComision.and.returnValue(of(mockStudents));
        
        component.ngOnInit();
        
        expect(component.students.length).toBe(1);
        expect(component.concepts).toContain('Parcial 1');
        expect(component.students[0].newState).toBe('CURSANDO');
    });

    it('should detect changes correctly', () => {
        component.students = [{
            studentId: '1',
            newGrade: 8,
            prevNewGrade: null,
            newState: 'REGULAR',
            prevNewState: 'REGULAR'
        }] as any;
        
        expect(component.hasChanges()).toBeTrue();
    });

    it('should save grades successfully', () => {
        const alertService = TestBed.inject(AlertService);
        professorService.cargarNotasComision.and.returnValue(of({} as any));
        spyOn(component, 'loadStudents');
        
        component.students = [{
            studentId: '1',
            newGrade: 8,
            prevNewGrade: null,
            newState: 'REGULAR',
            prevNewState: 'REGULAR'
        }] as any;
        component.concepto = 'Parcial 1';
        
        component.saveGrades();
        
        expect(professorService.cargarNotasComision).toHaveBeenCalled();
        expect(alertService.success).toHaveBeenCalled();
        expect(component.loadStudents).toHaveBeenCalled();
    });

    it('should validate concepto on save', () => {
        const alertService = TestBed.inject(AlertService);
        component.students = [{ newGrade: 8, prevNewGrade: null }] as any;
        component.esNotaFinal = false;
        component.concepto = '';
        
        component.saveGrades();
        
        expect(alertService.error).toHaveBeenCalledWith('Debe ingresar un concepto para la nota (ej: 1er Parcial)');
        expect(professorService.cargarNotasComision).not.toHaveBeenCalled();
    });

    it('should navigate back on cancel', () => {
        const router = TestBed.inject(Router);
        component.cancel();
        expect(router.navigate).toHaveBeenCalledWith(['/professor/my-commissions']);
    });
});
