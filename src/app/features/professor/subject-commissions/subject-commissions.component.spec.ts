import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectCommissionsComponent } from './subject-commissions.component';
import { ProfessorService } from '@core/services/professor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SubjectCommissionsComponent', () => {
    let component: SubjectCommissionsComponent;
    let fixture: ComponentFixture<SubjectCommissionsComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getComisionesByMateria']);
        const activatedRouteSpy = {
            paramMap: of({ get: (key: string) => '1' }),
            snapshot: { queryParamMap: { get: (key: string) => 'Test Subject' } }
        };
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [SubjectCommissionsComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SubjectCommissionsComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getComisionesByMateria.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
