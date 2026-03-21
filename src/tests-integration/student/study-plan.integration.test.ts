/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { StudyPlanComponent } from '@features/student/study-plan/study-plan.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { of } from 'rxjs';

describe('Study Plan Integration', () => {
    let mockMatriculacionService: jasmine.SpyObj<MatriculacionService>;

    beforeEach(() => {
        mockMatriculacionService = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias']);
    });

    it('should load study plan and display subjects', async () => {
        const planMock = [{
            materias: [
                { 
                    id: 101, 
                    nombre: 'Programación I', 
                    estado: 'APROBADA', 
                    nota: 9,
                    correlativas: []
                }
            ]
        }] as any;
        mockMatriculacionService.getMisCarrerasMaterias.and.returnValue(of(planMock));

        await render(StudyPlanComponent, {
            providers: [
                { provide: MatriculacionService, useValue: mockMatriculacionService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Programación I')).toBeTruthy();
        });
    });
});
