import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorExamStatisticsComponent } from './professor-exam-statistics.component';
import { ProfessorService } from '@core/services/professor.service';
import { of, throwError } from 'rxjs';
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

    it('should load filters on init', () => {
        const mockYears = [2023, 2024];
        const mockSubjects = [{ id: 'M1', nombre: 'Materia 1' }] as any;
        professorService.getAniosEstadisticas.and.returnValue(of(mockYears));
        professorService.getMisMaterias.and.returnValue(of(mockSubjects));
        
        component.ngOnInit();
        
        expect(component.years).toEqual(mockYears);
        expect(component.subjects).toEqual(mockSubjects);
    });

    it('should load stats and format chart data', () => {
        const mockStats = {
            cantidadPromocionados: 10,
            cantidadRegulares: 20,
            cantidadLibres: 5
        } as any;
        professorService.getEstadisticasGeneral.and.returnValue(of(mockStats));
        
        component.loadStats();
        
        expect(component.courseStatusData.length).toBe(3);
        expect(component.courseStatusData[0]).toEqual({ name: 'Promocionados', value: 10 });
        expect(component.isLoading).toBeFalse();
    });

    it('should load subject statistics when subject is selected', () => {
        const mockStats = {
            cantidadPromocionados: 5,
            cantidadRegulares: 5,
            cantidadLibres: 1
        } as any;
        professorService.getEstadisticasMateria = jasmine.createSpy().and.returnValue(of(mockStats));
        
        component.selectedSubject = 'M1';
        component.loadStats();
        
        expect(professorService.getEstadisticasMateria).toHaveBeenCalledWith('M1', undefined);
        expect(component.courseStatusData[0].value).toBe(5);
    });

    it('should handle error when loading stats', () => {
        professorService.getEstadisticasGeneral.and.returnValue(throwError(() => new Error('Error')));
        
        component.loadStats();
        
        expect(component.error).toBe('No se pudieron cargar las estadísticas.');
        expect(component.isLoading).toBeFalse();
    });
});
