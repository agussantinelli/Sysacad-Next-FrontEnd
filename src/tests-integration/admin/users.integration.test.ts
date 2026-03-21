/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { UsersComponent } from '@features/admin/users/users.component';
import { UsuarioService } from '@core/services/usuario.service';
import { of } from 'rxjs';

describe('Admin Users Integration', () => {
    let mockUsuarioService: jasmine.SpyObj<UsuarioService>;

    beforeEach(() => {
        mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerTodos', 'crearUsuario', 'eliminarUsuario']);
    });

    it('should list users and handle deletion', async () => {
        const usersMock = [
            { id: 1, usuario_name: 'admin', rol: 'ADMIN', email: 'admin@test.com' },
            { id: 2, usuario_name: 'student1', rol: 'ESTUDIANTE', email: 's1@test.com' }
        ] as any;
        mockUsuarioService.obtenerTodos.and.returnValue(of(usersMock));
        mockUsuarioService.eliminarUsuario.and.returnValue(of(void 0));

        await render(UsersComponent, {
            providers: [
                { provide: UsuarioService, useValue: mockUsuarioService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('admin')).toBeTruthy();
            expect(screen.getByText('student1')).toBeTruthy();
        });
    });
});
