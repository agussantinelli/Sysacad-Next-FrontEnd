import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { AdminCommissionsComponent } from '@/app/features/admin/commissions/admin-commissions.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Admin Commissions Integration', () => {
    const mockAdminService = {
        getAllComisiones: vi.fn(),
        getAllCarreras: vi.fn(),
        getSalonesDisponibles: vi.fn(),
        getPlanDetalle: vi.fn(),
        getProfesoresDisponibles: vi.fn(),
        asignarMateriaComision: vi.fn()
    };
    const mockAlertService = {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn()
    };

    it('should validate hours during assignment wizard', async () => {
        const commissionMock = [{ 
            id: 'c1', 
            nombre: 'Comision A', 
            idCarrera: 'car1', 
            anio: 2024, 
            nivel: 1 
        }];
        const planMock = {
            materias: [{ id: 'm1', nombre: 'Matematica', horasCursado: 4, nivel: 1 }]
        };

        mockAdminService.getAllComisiones.mockReturnValue(of(commissionMock));
        mockAdminService.getAllCarreras.mockReturnValue(of([{ id: 'car1', nombre: 'Carrera 1' }]));
        mockAdminService.getPlanDetalle.mockReturnValue(of(planMock));

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
        await waitFor(() => expect(screen.getByText('Matematica')).toBeInTheDocument());
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

        expect(mockAlertService.warning).toHaveBeenCalledWith(expect.stringContaining('Debe asignar exactamente 4 horas'));
    });
});
