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
});
