/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { AdminCommissionsComponent } from '@features/admin/commissions/admin-commissions.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info', 'clear']);
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

        const { fixture } = await render(AdminCommissionsComponent, {
            imports: [FormsModule],
            providers: [
                { provide: AdminService, useValue: mockAdminService },
                { provide: AlertService, useValue: mockAlertService }
            ]
        });

        fixture.detectChanges();

        // 1. Seleccionar comisión
        const card = await screen.findByText(/Comision A/i);
        fireEvent.click(card);
        
        // 2. Abrir modal de asignación
        const addBtn = await screen.findByRole('button', { name: /Agregar Materia/i });
        fireEvent.click(addBtn);

        // 3. Seleccionar materia
        const materiaItem = await screen.findByText('Matematica');
        fireEvent.click(materiaItem);

        // 4. Agregar horario insuficiente (2 horas)
        const daySelect = await screen.findByLabelText(/Día/i);
        const fromInput = screen.getByLabelText(/Desde/i);
        const toInput = screen.getByLabelText(/Hasta/i);
        const saveHourBtn = screen.getByRole('button', { name: /Agregar/i });

        fireEvent.change(daySelect, { target: { value: 'LUNES' } });
        fireEvent.input(fromInput, { target: { value: '08:00' } });
        fireEvent.input(toInput, { target: { value: '10:00' } });
        fireEvent.click(saveHourBtn);

        // 5. Intentar pasar al siguiente paso
        const nextBtn = await screen.findByRole('button', { name: /Siguiente/i });
        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(mockAlertService.warning).toHaveBeenCalled();
        });
    });
});
