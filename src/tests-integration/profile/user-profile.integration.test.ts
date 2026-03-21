/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { ProfileComponent } from '@features/profile/profile.component';
import { AuthService } from '@core/services/auth.service';
import { UsuarioService } from '@core/services/usuario.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('User Profile Integration', () => {
    let mockAuthService: any;
    let mockUsuarioService: jasmine.SpyObj<UsuarioService>;

    beforeEach(() => {
        const userMock = { 
            id: 's1', 
            nombre: 'Agustin', 
            apellido: 'Santinelli', 
            mail: 'agustin@test.com', 
            rol: 'STUDENT',
            dni: '12345',
            telefono: '111',
            direccion: 'Calle 1',
            ciudad: 'CABA',
            legajo: 123
        };

        mockAuthService = {
            currentUser$: of(userMock),
            updateUser: jasmine.createSpy('updateUser')
        };
        mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerPorId', 'subirFotoPerfil']);
        mockUsuarioService.obtenerPorId.and.returnValue(of(userMock as any));

        // Mock localStorage
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            if (key === 'user') return JSON.stringify({ id: 's1' });
            return null;
        });
    });

    it('should display user data correctly', async () => {
        await render(ProfileComponent, {
            imports: [RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: UsuarioService, useValue: mockUsuarioService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Agustin/i })).toBeTruthy();
            expect(screen.getByText(/Santinelli/i)).toBeTruthy();
            expect(screen.getByText(/agustin@test.com/i)).toBeTruthy();
        });

        expect(mockUsuarioService.obtenerPorId).toHaveBeenCalled();
    });
});
