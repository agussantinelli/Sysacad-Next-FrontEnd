/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { ProfileComponent } from '@features/profile/profile.component';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';

describe('User Profile Integration', () => {
    let mockAuthService: any;

    beforeEach(() => {
        mockAuthService = {
            currentUser$: of({ id: 's1', nombre: 'Agustin', email: 'agustin@test.com', rol: 'STUDENT' })
        };
    });

    it('should display user data correctly', async () => {
        const { fixture } = await render(ProfileComponent, {
            providers: [
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        fixture.detectChanges();

        await waitFor(() => {
            expect(screen.getByText('Agustin')).toBeTruthy();
            expect(screen.getByText('agustin@test.com')).toBeTruthy();
        });
    });
});
