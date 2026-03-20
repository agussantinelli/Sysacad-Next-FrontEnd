import { render, screen, waitFor } from '@testing-library/angular';
import { ProfileComponent } from '@/app/features/profile/profile.component';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('User Profile Integration', () => {
    const mockAuthService = {
        currentUser$: of({ id: 's1', nombre: 'Agustin', email: 'agustin@test.com', rol: 'STUDENT' })
    };

    it('should display user data correctly', async () => {
        await render(ProfileComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Agustin')).toBeInTheDocument();
            expect(screen.getByText('agustin@test.com')).toBeInTheDocument();
        });
    });
});
