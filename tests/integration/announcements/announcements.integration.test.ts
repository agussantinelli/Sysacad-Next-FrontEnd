import { render, screen, waitFor } from '@testing-library/angular';
import { AnnouncementsComponent } from '@features/announcements/announcements.component';
import { AvisoService } from '@core/services/aviso.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Announcements Integration', () => {
    const mockAvisoService = {
        listarAvisos: vi.fn(),
        marcarLeido: vi.fn()
    };

    it('should show list of announcements from AvisoService', async () => {
        const announcementsMock = [
            { id: 1, titulo: 'Nueva Mesa de Final', contenido: 'Se abren inscripciones.' }
        ];
        mockAvisoService.listarAvisos.mockReturnValue(of(announcementsMock));

        await render(AnnouncementsComponent, {
            providers: [
                { provide: AvisoService, useValue: mockAvisoService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Nueva Mesa de Final')).toBeInTheDocument();
        });
    });
});
