import { render, screen, waitFor, fireEvent } from '@testing-library/angular';
import { MyCommissionsComponent } from '@/app/features/professor/my-commissions/my-commissions.component';
import { ProfessorService } from '@core/services/professor.service';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Professor MyCommissions Integration', () => {
    const mockProfessorService = {
        getMisComisiones: vi.fn()
    };
    const mockAuthService = {
        currentUser$: of({ id: 'p1', nombre: 'Prof. Test' })
    };

    it('should list assigned commissions for the professor', async () => {
        const commissionsMock = [
            { id: 'c1', nombreComision: 'Lab III - C1', materiaNombre: 'Lab III', alumnosInscriptos: 20 }
        ];
        mockProfessorService.getMisComisiones.mockReturnValue(of(commissionsMock));

        await render(MyCommissionsComponent, {
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Lab III - C1')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();
        });
    });
});
