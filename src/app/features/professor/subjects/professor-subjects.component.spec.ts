import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorSubjectsComponent } from './professor-subjects.component';
import { ProfessorService } from '@core/services/professor.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfessorSubjectsComponent', () => {
    let component: ProfessorSubjectsComponent;
    let fixture: ComponentFixture<ProfessorSubjectsComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getMisMaterias']);

        await TestBed.configureTestingModule({
            imports: [ProfessorSubjectsComponent, NoopAnimationsModule, RouterTestingModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorSubjectsComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getMisMaterias.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
