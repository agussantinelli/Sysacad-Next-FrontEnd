import { render, screen, waitFor } from '@testing-library/angular';
import { CurrentEnrollmentsComponent } from '@features/student/current-enrollments/current-enrollments.component';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Current Enrollments Integration', () => {
    const mockInscripcionService = {
        obtenerCursadasActuales: vi.fn()
    };
    const mockAuthService = {
        currentUser$: of({ id: 1, nombre: 'Test Student' })
    };

    it('should load current enrollments including grades', async () => {
        const enrollmentsMock = [
            { 
                id: 1, 
                nombreMateria: 'Laboratorio III', 
                nombreComision: 'C1', 
                anioCursado: 2024,
                calificaciones: [{ descripcion: 'Parcial 1', nota: 8 }] 
            }
        ];
        mockInscripcionService.obtenerCursadasActuales.mockReturnValue(of(enrollmentsMock));

        await render(CurrentEnrollmentsComponent, {
            providers: [
                { provide: InscripcionCursadoService, useValue: mockInscripcionService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Laboratorio III')).toBeInTheDocument();
            expect(screen.getByText(/Parcial 1: 8/i)).toBeInTheDocument();
        });
    });
});
