import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorExamsComponent } from './professor-exams.component';
import { ProfessorService } from '@core/services/professor.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfessorExamsComponent', () => {
    let component: ProfessorExamsComponent;
    let fixture: ComponentFixture<ProfessorExamsComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getMesasExamen']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ProfessorExamsComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorExamsComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getMesasExamen.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
