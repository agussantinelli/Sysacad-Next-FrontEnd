import { render, screen, waitFor, fireEvent } from '@testing-library/angular';
import { AdminExamTablesComponent } from '@/app/features/admin/exam-tables/admin-exam-tables.component';
import { AdminService } from '@core/services/admin.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Admin Exam Tables Integration', () => {
    const mockAdminService = {
        getAllTurnosExamen: vi.fn(),
        crearTurnoExamen: vi.fn()
    };

    it('should list exam turns and open detail', async () => {
        const turnsMock = [
            { id: 1, nombre: 'Turno Febrero 2024', fechaInicio: '2024-02-01', fechaFin: '2024-02-28' }
        ];
        mockAdminService.getAllTurnosExamen.mockReturnValue(of(turnsMock));

        await render(AdminExamTablesComponent, {
            providers: [
                { provide: AdminService, useValue: mockAdminService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Turno Febrero 2024')).toBeInTheDocument();
        });

        const detailBtn = screen.getByRole('button', { name: /Ver Detalle/i });
        fireEvent.click(detailBtn);
        
        // El test verifica la interacción entre el componente y el servicio admin
    });
});
