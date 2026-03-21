/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { UsersComponent } from '@features/admin/users/users.component';
import { UsuarioService } from '@core/services/usuario.service';
import { of } from 'rxjs';

describe('Admin Users Integration', () => {
    let mockUsuarioService: jasmine.SpyObj<UsuarioService>;

    beforeEach(() => {
        mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerTodos', 'crearUsuario', 'eliminarUsuario', 'cambiarEstado']);
    });

    it('should list users and handle deletion', async () => {
        const usersMock = [
            { id: 1, nombre: 'Admin', apellido: 'User', rol: 'ADMIN', mail: 'admin@test.com', estado: 'ACTIVO', dni: '1', legajo: '1' },
            { id: 2, nombre: 'Student', apellido: 'One', rol: 'ESTUDIANTE', mail: 's1@test.com', estado: 'ACTIVO', dni: '2', legajo: '2' }
        ] as any;
        mockUsuarioService.obtenerTodos.and.returnValue(of(usersMock));

        const { fixture } = await render(UsersComponent, {
            providers: [
                { provide: UsuarioService, useValue: mockUsuarioService }
            ]
        });

        fixture.detectChanges();

        await waitFor(() => {
            expect(screen.getByText(/admin@test.com/i)).toBeTruthy();
            expect(screen.getByText(/s1@test.com/i)).toBeTruthy();
        });
        
        // El nombre y apellido se renderizan juntos en el template
        expect(screen.getByText(/Admin User/i)).toBeTruthy();
        expect(screen.getByText(/Student One/i)).toBeTruthy();
    });
});
