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
});
