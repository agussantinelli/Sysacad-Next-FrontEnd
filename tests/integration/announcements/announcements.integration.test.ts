import { render, screen, waitFor } from '@testing-library/angular';
import { AnnouncementsComponent } from '../../../src/app/features/announcements/announcements.component';
import { AvisoService } from '../../../src/app/core/services/aviso.service';
import { of } from 'rxjs';

describe('Announcements Integration', () => {
    let mockAvisoService: jasmine.SpyObj<AvisoService>;

    beforeEach(() => {
        mockAvisoService = jasmine.createSpyObj('AvisoService', ['listarAvisos', 'marcarLeido']);
    });

    it('should show list of announcements from AvisoService', async () => {
        const announcementsMock = [
            { id: 1, titulo: 'Nueva Mesa de Final', contenido: 'Se abren inscripciones.' }
        ] as any;
        mockAvisoService.listarAvisos.and.returnValue(of(announcementsMock));

        await render(AnnouncementsComponent, {
            providers: [
                { provide: AvisoService, useValue: mockAvisoService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Nueva Mesa de Final')).toBeTruthy();
        });
    });
});
