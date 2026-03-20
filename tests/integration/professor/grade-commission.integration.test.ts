import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ProfessorGradeCommissionComponent } from '@/app/features/professor/grade-commission/professor-grade-commission.component';
import { ProfessorService } from '@core/services/professor.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Professor Grade Commission Integration', () => {
    const mockProfessorService = {
        getAlumnosInscriptos: vi.fn(),
        cargarNotaCursada: vi.fn()
    };

    it('should enter grades and success notification should appear', async () => {
        mockProfessorService.getAlumnosInscriptos.mockReturnValue(of([
            { id: 'a1', nombre: 'Student A', legajo: 'L1', nota: null }
        ]));
        mockProfessorService.cargarNotaCursada.mockReturnValue(of({ success: true }));

        await render(ProfessorGradeCommissionComponent, {
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService }
            ]
        });

        await waitFor(() => expect(screen.getByText('Student A')).toBeInTheDocument());

        const notaInput = screen.getByPlaceholderText(/Nota/i);
        fireEvent.input(notaInput, { target: { value: '8' } });

        const saveBtn = screen.getByRole('button', { name: /Guardar Nota/i });
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(mockProfessorService.cargarNotaCursada).toHaveBeenCalled();
            expect(screen.getByText(/Nota guardada con éxito/i)).toBeInTheDocument();
        });
    });
});
