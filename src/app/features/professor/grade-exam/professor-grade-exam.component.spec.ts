import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorGradeExamComponent } from './professor-grade-exam.component';
import { ProfessorService } from '@core/services/professor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfessorGradeExamComponent', () => {
    let component: ProfessorGradeExamComponent;
    let fixture: ComponentFixture<ProfessorGradeExamComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getInscriptosExamen', 'cargarNotasExamen']);
        const activatedRouteSpy = {
            snapshot: { paramMap: { get: (key: string) => (key === 'idMesa' ? '1' : '1') } }
        };
        const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);

        await TestBed.configureTestingModule({
            imports: [ProfessorGradeExamComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorGradeExamComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getInscriptosExamen.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load inscriptos on init', () => {
        const mockAlumnos = [{ idInscripcion: '1', apellido: 'Perez', estado: 'PENDIENTE' }] as any;
        professorService.getInscriptosExamen.and.returnValue(of(mockAlumnos));
        
        component.ngOnInit();
        
        expect(professorService.getInscriptosExamen).toHaveBeenCalledWith('1', 1);
        expect(component.inscriptos[0].apellido).toBe('Perez');
        expect(component.inscriptos[0].estado).toBe('PENDIENTE');
    });

    it('should validate grades correctly', () => {
        component.inscriptos = [
            { apellido: 'A', estado: 'APROBADO', nota: 5 }
        ] as any;
        expect(component.validateGrades()).toBeFalse();
        expect(component.error).toContain('nota inválida');

        component.inscriptos = [
            { apellido: 'B', estado: 'DESAPROBADO', nota: 7 }
        ] as any;
        expect(component.validateGrades()).toBeFalse();
        expect(component.error).toContain('debe ser menor a 6');

        component.inscriptos = [
            { apellido: 'C', estado: 'APROBADO', nota: 8 }
        ] as any;
        expect(component.validateGrades()).toBeTrue();
    });

    it('should save grades successfully', () => {
        const router = TestBed.inject(Router);
        professorService.cargarNotasExamen.and.returnValue(of({} as any));
        
        component.inscriptos = [
            { idInscripcion: '1', apellido: 'A', estado: 'APROBADO', nota: 8 }
        ] as any;
        
        component.saveGrades();
        
        expect(professorService.cargarNotasExamen).toHaveBeenCalled();
        expect(component.successMessage).toBe('Notas guardadas exitosamente.');
    });

    it('should navigate back on goBack', () => {
        const router = TestBed.inject(Router);
        component.idMesa = '123';
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/professor/exams', '123']);
    });
});
