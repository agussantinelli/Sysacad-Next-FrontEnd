import { render, screen, waitFor } from '@testing-library/angular';
import { AcademicStatusComponent } from '@features/student/academic-status/academic-status.component';
import { StudentService } from '@core/services/student.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Academic Status Integration', () => {
    const mockStudentService = {
        getHistory: vi.fn()
    };

    it('should display career progress and enrollment list', async () => {
        const historyMock = {
            carrera: 'Ingeniería en Sistemas',
            promedio: 8.5,
            materiasAprobadas: 45,
            totalMaterias: 50,
            inscripciones: [
                { id: 1, materia: 'Análisis Matemático I', nota: 9, estado: 'Aprobada' },
                { id: 2, materia: 'Física I', nota: 8, estado: 'Aprobada' }
            ]
        };
        mockStudentService.getHistory.mockReturnValue(of(historyMock));

        await render(AcademicStatusComponent, {
            providers: [
                { provide: StudentService, useValue: mockStudentService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText(/Ingeniería en Sistemas/i)).toBeInTheDocument();
            expect(screen.getByText('Análisis Matemático I')).toBeInTheDocument();
        });
    });
});
