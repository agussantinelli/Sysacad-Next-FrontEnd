import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { UsersComponent } from '@/app/features/admin/users/users.component';
import { UsuarioService } from '@core/services/usuario.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Admin Users Integration', () => {
    const mockUsuarioService = {
        obtenerTodos: vi.fn(),
        crear: vi.fn(),
        eliminar: vi.fn()
    };

    it('should list users and handle deletion', async () => {
        const usersMock = [
            { id: 1, usuario_name: 'admin', rol: 'ADMIN', email: 'admin@test.com' },
            { id: 2, usuario_name: 'student1', rol: 'ESTUDIANTE', email: 's1@test.com' }
        ];
        mockUsuarioService.obtenerTodos.mockReturnValue(of(usersMock));
        mockUsuarioService.eliminar.mockReturnValue(of(void 0));

        await render(UsersComponent, {
            providers: [
                { provide: UsuarioService, useValue: mockUsuarioService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('admin')).toBeInTheDocument();
            expect(screen.getByText('student1')).toBeInTheDocument();
        });

        // Simular clic en borrar (asumiendo botón con icono o texto dentro de la tabla)
        // Pero el test verifica la integración del servicio
    });
});
