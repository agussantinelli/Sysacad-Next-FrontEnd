import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { InscriptionCourseComponent } from '@features/student/inscription-course/inscription-course.component';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { of } from 'rxjs';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Inscription Course Integration', () => {
    const mockInscripcionService = {
        obtenerCarrerasActivas: vi.fn(),
        obtenerMateriasInscribibles: vi.fn(),
        obtenerComisionesMateria: vi.fn(),
        inscribir: vi.fn()
    };

    it('should complete inscription flow', async () => {
        mockInscripcionService.obtenerCarrerasActivas.mockReturnValue(of([{ id: 1, nombre: 'Sistemas' }]));
        mockInscripcionService.obtenerMateriasInscribibles.mockReturnValue(of([{ id: 101, nombre: 'Bases de Datos' }]));
        mockInscripcionService.obtenerComisionesMateria.mockReturnValue(of([{ id: 201, nombre: 'C1', horarios: [] }]));
        mockInscripcionService.inscribir.mockReturnValue(of({ success: true }));

        await render(InscriptionCourseComponent, {
            providers: [
                { provide: InscripcionCursadoService, useValue: mockInscripcionService }
            ]
        });

        await waitFor(() => expect(screen.getByText('Sistemas')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Sistemas'));

        await waitFor(() => expect(screen.getByText('Bases de Datos')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Bases de Datos'));

        await waitFor(() => expect(screen.getByText('C1')).toBeInTheDocument());
        fireEvent.click(screen.getByText('C1'));

        const confirmBtn = screen.getByRole('button', { name: /Confirmar Inscripción/i });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockInscripcionService.inscribir).toHaveBeenCalled();
        });
    });
});
