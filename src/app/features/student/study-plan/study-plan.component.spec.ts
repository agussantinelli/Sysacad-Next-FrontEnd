import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyPlanComponent } from './study-plan.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StudyPlanComponent', () => {
    let component: StudyPlanComponent;
    let fixture: ComponentFixture<StudyPlanComponent>;
    let matriculacionService: jasmine.SpyObj<MatriculacionService>;

    beforeEach(async () => {
        const matriculacionSpy = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias']);

        await TestBed.configureTestingModule({
            imports: [StudyPlanComponent, NoopAnimationsModule],
            providers: [
                { provide: MatriculacionService, useValue: matriculacionSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(StudyPlanComponent);
        component = fixture.componentInstance;
        matriculacionService = TestBed.inject(MatriculacionService) as jasmine.SpyObj<MatriculacionService>;

        matriculacionService.getMisCarrerasMaterias.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load and process data on init', () => {
        const mockData = [{
            materias: [
                { 
                    id: '1', 
                    nombre: 'M1', 
                    cuatrimestre: '1', 
                    esElectiva: true,
                    correlativas: [{ nombre: 'M0', condicion: 'REGULAR' }]
                }
            ]
        }] as any;
        matriculacionService.getMisCarrerasMaterias.and.returnValue(of(mockData));
        
        component.loadData();
        
        expect(component.displayData.length).toBe(1);
        expect(component.displayData[0].cuatrimestre).toBe('CUATRIMESTRAL');
        expect(component.displayData[0].esElectiva).toBe('SÍ');
        expect(component.displayData[0].correlativasList[0].badge).toBe('R');
    });

    it('should handle viewCorrelatives action', () => {
        const mockRow = { 
            nombre: 'M1', 
            correlativasList: [{ nombre: 'M0', condicion: 'R' }] 
        };
        component.handleAction({ action: 'viewCorrelatives', row: mockRow });
        
        expect(component.showModal).toBeTrue();
        expect(component.selectedSubjectName).toBe('M1');
        expect(component.selectedCorrelatives.length).toBe(1);
    });

    it('should close modal', () => {
        component.showModal = true;
        component.closeModal();
        expect(component.showModal).toBeFalse();
        expect(component.selectedSubjectName).toBe('');
    });
});
