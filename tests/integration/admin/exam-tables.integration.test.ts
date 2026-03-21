import { render, screen, waitFor, fireEvent } from '@testing-library/angular';
import { AdminExamTablesComponent } from '../../../src/app/features/admin/exam-tables/admin-exam-tables.component';
import { AdminService } from '../../../src/app/core/services/admin.service';
import { of } from 'rxjs';

describe('Admin Exam Tables Integration', () => {
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(() => {
        mockAdminService = jasmine.createSpyObj('AdminService', ['getAllTurnos', 'crearTurno']);
    });

    it('should list exam turns and open detail', async () => {
        const turnsMock = [
            { id: 1, nombre: 'Turno Febrero 2024', fechaInicio: '2024-02-01', fechaFin: '2024-02-28' }
        ] as any;
        mockAdminService.getAllTurnos.and.returnValue(of(turnsMock));

        await render(AdminExamTablesComponent, {
            providers: [
                { provide: AdminService, useValue: mockAdminService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Turno Febrero 2024')).toBeTruthy();
        });

        const detailBtn = screen.getByRole('button', { name: /Ver Detalle/i });
        fireEvent.click(detailBtn);
    });
});
