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
});
