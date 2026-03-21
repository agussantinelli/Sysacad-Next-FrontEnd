/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { AdminCommissionsComponent } from '@features/admin/commissions/admin-commissions.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';

describe('Admin Commissions Integration', () => {
    let mockAdminService: jasmine.SpyObj<AdminService>;
    let mockAlertService: jasmine.SpyObj<AlertService>;

    beforeEach(() => {
        mockAdminService = jasmine.createSpyObj('AdminService', [
            'getAllComisiones',
            'getAllCarreras',
            'getSalonesDisponibles',
            'getPlanDetalle',
            'getProfesoresDisponibles',
            'asignarMateriaComision'
        ]);
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning']);
    });

    it('should validate hours during assignment wizard', async () => {
        const commissionMock = [{ 
            id: 'c1', 
            nombre: 'Comision A', 
            idCarrera: 'car1', 
            anio: 2024, 
            nivel: 1 
        }] as any;
        const planMock = {
            materias: [{ id: 'm1', nombre: 'Matematica', horasCursado: 4, nivel: 1 }]
        } as any;

        mockAdminService.getAllComisiones.and.returnValue(of(commissionMock));
        mockAdminService.getAllCarreras.and.returnValue(of([{ id: 'car1', nombre: 'Carrera 1' } as any]));
        mockAdminService.getPlanDetalle.and.returnValue(of(planMock));

        await render(AdminCommissionsComponent, {
            providers: [
                { provide: AdminService, useValue: mockAdminService },
                { provide: AlertService, useValue: mockAlertService }
            ]
        });

        // Seleccionar comision
        fireEvent.click(await screen.findByText('Comision A'));
        
        // Abrir modal de asignacion
        const assignBtn = screen.getByRole('button', { name: /Asignar Materia/i });
        fireEvent.click(assignBtn);

        // Seleccionar materia
        await waitFor(() => expect(screen.getByText('Matematica')).toBeTruthy());
        fireEvent.click(screen.getByText('Matematica'));

        // Agregar horario insuficiente (2 horas)
        const daySelect = screen.getByLabelText(/Día/i);
        const fromInput = screen.getByLabelText(/Desde/i);
        const toInput = screen.getByLabelText(/Hasta/i);
        const addBtn = screen.getByRole('button', { name: /Agregar Horario/i });

        fireEvent.change(daySelect, { target: { value: 'LUNES' } });
        fireEvent.input(fromInput, { target: { value: '08:00' } });
        fireEvent.input(toInput, { target: { value: '10:00' } });
        fireEvent.click(addBtn);

        // Intentar pasar al siguiente paso
        const nextBtn = screen.getByRole('button', { name: /Siguiente/i });
        fireEvent.click(nextBtn);

        screen.debug();
        expect(mockAlertService.warning).toHaveBeenCalledWith(jasmine.stringMatching(/Debe asignar exactamente 4 horas/));
    });
});
