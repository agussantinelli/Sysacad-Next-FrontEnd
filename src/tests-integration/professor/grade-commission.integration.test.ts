/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ProfessorGradeCommissionComponent } from '@features/professor/grade-commission/professor-grade-commission.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';

describe('Professor Grade Commission Integration', () => {
    let mockProfessorService: jasmine.SpyObj<ProfessorService>;
    let mockAlertService: jasmine.SpyObj<AlertService>;

    beforeEach(() => {
        mockProfessorService = jasmine.createSpyObj('ProfessorService', ['getInscriptosComision', 'cargarNotasComision']);
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'info', 'clear']);
    });

    it('should enter grades and success notification should appear', async () => {
        const studentsMock = [
            { idInscripcion: '1', nombre: 'Student', apellido: 'A', legajo: 123, estado: 'CURSANDO', calificaciones: [] }
        ] as any;
        mockProfessorService.getInscriptosComision.and.returnValue(of(studentsMock));
        mockProfessorService.cargarNotasComision.and.returnValue(of(void 0));

        await render(ProfessorGradeCommissionComponent, {
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService },
                { provide: AlertService, useValue: mockAlertService }
            ]
        });

        await waitFor(() => expect(screen.getByText('Student A')).toBeTruthy());

        // In this component, we don't have a placeholder "Nota", it's an input inside a table.
        // We can find it by its type or role if applicable, or just use getAllByRole('textbox').
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.input(inputs[0], { target: { value: '8' } });

        const saveBtn = screen.getByRole('button', { name: /Guardar Notas/i });
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(mockProfessorService.cargarNotasComision).toHaveBeenCalled();
            expect(mockAlertService.success).toHaveBeenCalledWith('Notas guardadas correctamente');
        });
    });
});
