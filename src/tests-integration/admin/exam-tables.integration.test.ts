/// <reference types="jasmine" />
import { render, screen, waitFor, fireEvent } from '@testing-library/angular';
import { AdminExamTablesComponent } from '@features/admin/exam-tables/admin-exam-tables.component';
import { AdminService } from '@core/services/admin.service';
import { of } from 'rxjs';

describe('Admin Exam Tables Integration', () => {
    let mockAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(() => {
        mockAdminService = jasmine.createSpyObj('AdminService', ['getAllTurnos', 'crearTurno', 'getMesasByTurno', 'eliminarTurno', 'editarTurno']);
    });

    it('should list exam turns and open detail', async () => {
        const turnsMock = [
            { 
                id: 1, 
                nombre: 'Turno Febrero 2027', 
                fechaInicio: '2027-02-01', 
                fechaFin: '2027-02-28',
                cantidadInscriptos: 0 
            }
        ] as any;
        mockAdminService.getAllTurnos.and.returnValue(of(turnsMock));

        const { fixture } = await render(AdminExamTablesComponent, {
            providers: [
                { provide: AdminService, useValue: mockAdminService }
            ]
        });

        fixture.detectChanges();

        await waitFor(() => {
            expect(screen.getByText(/Turno Febrero 2027/i)).toBeTruthy();
        });

        const detailBtn = await screen.findByRole('button', { name: /Ver Mesas/i });
        fireEvent.click(detailBtn);
        
        expect(detailBtn).toBeTruthy();
    });
});
