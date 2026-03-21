/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ProfessorGradeCommissionComponent } from '@features/professor/grade-commission/professor-grade-commission.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('Professor Grade Commission Integration', () => {
    let mockProfessorService: jasmine.SpyObj<ProfessorService>;
    let mockAlertService: jasmine.SpyObj<AlertService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        mockProfessorService = jasmine.createSpyObj('ProfessorService', ['getInscriptosComision', 'cargarNotasComision']);
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'info', 'clear']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    });

    it('should enter grades and success notification should appear', async () => {
        const studentsMock = [{ 
            idInscripcion: 's1', 
            legajo: 12345, 
            nombre: 'Student', 
            apellido: 'A',
            calificaciones: [],
            estado: 'CURSANDO',
            notaFinal: null
        }] as any;
        
        mockProfessorService.getInscriptosComision.and.returnValue(of(studentsMock));
        mockProfessorService.cargarNotasComision.and.returnValue(of(void 0));

        const mockParamMap = convertToParamMap({ idComision: 'com1', idMateria: 'mat1' });
        const mockActivatedRoute = {
            paramMap: of(mockParamMap),
            snapshot: {
                paramMap: mockParamMap,
                params: { idComision: 'com1', idMateria: 'mat1' }
            }
        };

        const { fixture } = await render(ProfessorGradeCommissionComponent, {
            imports: [FormsModule],
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService },
                { provide: AlertService, useValue: mockAlertService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fixture.detectChanges();

        // 1. Verificar carga de datos
        await waitFor(() => {
            expect(screen.queryByText(/Información de comisión o materia no válida/i)).toBeNull();
            expect(screen.getByText(/Student A/i)).toBeTruthy();
        });

        // 2. Ingresar concepto (requerido para habilitar botón)
        const conceptoInput = screen.getByLabelText(/Concepto de la Nota:/i);
        fireEvent.input(conceptoInput, { target: { value: 'Parcial 1' } });
        
        // 3. Ingresar nota
        const gradeInput = screen.getByRole('spinbutton');
        fireEvent.input(gradeInput, { target: { value: '8' } });
        
        fixture.detectChanges();

        // 4. Guardar (Texto real: "Descargar y Recargar")
        const submitBtn = screen.getByRole('button', { name: /Descargar/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockProfessorService.cargarNotasComision).toHaveBeenCalled();
            expect(mockAlertService.success).toHaveBeenCalledWith('Notas guardadas correctamente');
        });
    });
});
