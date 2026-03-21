/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { MyCommissionsComponent } from '@features/professor/my-commissions/my-commissions.component';
import { ProfessorService } from '@core/services/professor.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('Professor MyCommissions Integration', () => {
    let mockProfessorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(() => {
        mockProfessorService = jasmine.createSpyObj('ProfessorService', ['getMisComisiones']);
    });

    it('should list assigned commissions for the professor', async () => {
        const commissionsMock = [
            { 
                idComision: 'c1', 
                nombre: 'Lab III - C1', // Match 'nombre' in template
                nombreMateria: 'Lab III', 
                cantidadAlumnos: 20, // Match 'cantidadAlumnos' in template
                anio: 2024,
                turno: 'NOCHE',
                salon: 'Aula 1',
                horarios: ['Lun 18-22']
            }
        ] as any;
        mockProfessorService.getMisComisiones.and.returnValue(of(commissionsMock));

        await render(MyCommissionsComponent, {
            imports: [RouterTestingModule],
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText(/Lab III - C1/i)).toBeTruthy();
            expect(screen.getByText(/Lab III/i, { selector: '.subject-tag' })).toBeTruthy();
            expect(screen.getByText('20')).toBeTruthy();
        });
    });
});
