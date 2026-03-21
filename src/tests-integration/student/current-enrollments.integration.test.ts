/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { CurrentEnrollmentsComponent } from '../../../src/app/features/student/current-enrollments/current-enrollments.component';
import { InscripcionCursadoService } from '../../../src/app/core/services/inscripcion-cursado.service';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { of } from 'rxjs';

describe('Current Enrollments Integration', () => {
    let mockInscripcionService: jasmine.SpyObj<InscripcionCursadoService>;
    let mockAuthService: any;

    beforeEach(() => {
        mockInscripcionService = jasmine.createSpyObj('InscripcionCursadoService', ['obtenerCursadasActuales']);
        mockAuthService = {
            currentUser$: of({ id: 1, nombre: 'Test Student' })
        };
    });

    it('should load current enrollments including grades', async () => {
        const enrollmentsMock = [
            { 
                id: 1, 
                nombreMateria: 'Laboratorio III', 
                nombreComision: 'C1', 
                anioCursado: 2024,
                calificaciones: [{ descripcion: 'Parcial 1', nota: 8 }] 
            }
        ] as any;
        mockInscripcionService.obtenerCursadasActuales.and.returnValue(of(enrollmentsMock));

        await render(CurrentEnrollmentsComponent, {
            providers: [
                { provide: InscripcionCursadoService, useValue: mockInscripcionService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Laboratorio III')).toBeTruthy();
            expect(screen.getByText(/Parcial 1: 8/i)).toBeTruthy();
        });
    });
});
