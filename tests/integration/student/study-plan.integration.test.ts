import { render, screen, waitFor } from '@testing-library/angular';
import { StudyPlanComponent } from '@features/student/study-plan/study-plan.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Study Plan Integration', () => {
    const mockMatriculacionService = {
        getMisCarrerasMaterias: vi.fn()
    };

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
        }];
        mockMatriculacionService.getMisCarrerasMaterias.mockReturnValue(of(planMock));

        await render(StudyPlanComponent, {
            providers: [
                { provide: MatriculacionService, useValue: mockMatriculacionService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Programación I')).toBeInTheDocument();
        });
    });
});
