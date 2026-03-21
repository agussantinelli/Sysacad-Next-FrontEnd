/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { MyCommissionsComponent } from '@features/professor/my-commissions/my-commissions.component';
import { ProfessorService } from '@core/services/professor.service';
import { of } from 'rxjs';

describe('Professor MyCommissions Integration', () => {
    let mockProfessorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(() => {
        mockProfessorService = jasmine.createSpyObj('ProfessorService', ['getMisComisiones']);
    });

    it('should list assigned commissions for the professor', async () => {
        const commissionsMock = [
            { idComision: 'c1', nombreComision: 'Lab III - C1', materiaNombre: 'Lab III', alumnosInscriptos: 20 }
        ] as any;
        mockProfessorService.getMisComisiones.and.returnValue(of(commissionsMock));

        const { fixture } = await render(MyCommissionsComponent, {
            providers: [
                { provide: ProfessorService, useValue: mockProfessorService }
            ]
        });

        fixture.detectChanges();

        await waitFor(() => {
            expect(screen.getByText('Lab III - C1')).toBeTruthy();
            expect(screen.getByText('20')).toBeTruthy();
        });
    });
});
