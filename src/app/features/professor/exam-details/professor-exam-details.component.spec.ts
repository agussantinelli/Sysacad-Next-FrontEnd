import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorExamDetailsComponent } from './professor-exam-details.component';
import { ProfessorService } from '@core/services/professor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfessorExamDetailsComponent', () => {
    let component: ProfessorExamDetailsComponent;
    let fixture: ComponentFixture<ProfessorExamDetailsComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getMesasExamen', 'getDetallesMesaExamen']);
        const activatedRouteSpy = {
            snapshot: { paramMap: { get: (key: string) => '1' } }
        };
        const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);

        await TestBed.configureTestingModule({
            imports: [ProfessorExamDetailsComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorExamDetailsComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getMesasExamen.and.returnValue(of([]));
        professorService.getDetallesMesaExamen.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
