/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { ProfessorGradeCommissionComponent } from '@features/professor/grade-commission/professor-grade-commission.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToParamMap } from '@angular/router';

describe('Professor Grade Commission Integration', () => {
    let mockProfessorService: jasmine.SpyObj<ProfessorService>;
    let mockAlertService: jasmine.SpyObj<AlertService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    beforeEach(() => {
        mockProfessorService = jasmine.createSpyObj('ProfessorService', ['getInscriptosComision', 'cargarNotasComision']);
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'info', 'clear']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockActivatedRoute = {
            paramMap: of(convertToParamMap({ idComision: 'c1', idMateria: 'm1' }))
        };
    });

    it('should enter grades and success notification should appear', async () => {
        const studentsMock = [{ 
            studentId: 's1', 
            legajo: 'L1', 
            studentName: 'Student A', 
            grades: {}, 
            originalState: 'CURSANDO', 
            newState: 'CURSANDO' 
        }] as any;
        mockProfessorService.getInscriptosComision.and.returnValue(of(studentsMock));
        mockProfessorService.cargarNotasComision.and.returnValue(of(void 0));

        const { fixture } = await render(ProfessorGradeCommissionComponent, {
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService },
                { provide: AlertService, useValue: mockAlertService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fixture.detectChanges();

        await waitFor(() => expect(screen.getByText('Student A')).toBeTruthy());

        const input = screen.getByRole('spinbutton');
        fireEvent.input(input, { target: { value: '8' } });
        
        // El botón dice "Descargar y Recargar" según el template cuando no está guardando
        const submitBtn = screen.getByRole('button', { name: /Descargar/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockProfessorService.cargarNotasComision).toHaveBeenCalled();
            expect(mockAlertService.success).toHaveBeenCalled();
        });
    });
});
