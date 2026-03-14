import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorExamStatisticsComponent } from './professor-exam-statistics.component';
import { ProfessorService } from '@core/services/professor.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfessorExamStatisticsComponent', () => {
    let component: ProfessorExamStatisticsComponent;
    let fixture: ComponentFixture<ProfessorExamStatisticsComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', [
            'getAniosEstadisticas', 
            'getMisMaterias', 
            'getEstadisticasGeneral'
        ]);

        await TestBed.configureTestingModule({
            imports: [ProfessorExamStatisticsComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorExamStatisticsComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getAniosEstadisticas.and.returnValue(of([]));
        professorService.getMisMaterias.and.returnValue(of([]));
        professorService.getEstadisticasGeneral.and.returnValue(of({
            cantidadPromocionados: 0,
            cantidadRegulares: 0,
            cantidadLibres: 0
        } as any));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
