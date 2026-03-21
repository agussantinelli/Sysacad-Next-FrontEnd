/// <reference types="jasmine" />
import { render, screen, waitFor } from '@testing-library/angular';
import { AcademicStatusComponent } from '../../../src/app/features/student/academic-status/academic-status.component';
import { MatriculacionService } from '../../../src/app/core/services/matriculacion.service';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

describe('Academic Status Integration', () => {
    let mockMatriculacionService: jasmine.SpyObj<MatriculacionService>;
    let mockAuthService: any;
    const currentUserSubject = new BehaviorSubject({ id: 'u1', nombre: 'Test User' });

    beforeEach(() => {
        mockMatriculacionService = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias', 'getHistorialMateria', 'getNotasCursada']);
        mockAuthService = {
            currentUser$: currentUserSubject.asObservable()
        };
    });

    it('should display career progress and enrollment list', async () => {
        const historyMock = [{ 
            materias: [
                { idMateria: 'm1', nombre: 'Matematica', estado: 'APROBADA', nota: 8, nivel: 1 },
                { idMateria: 'm2', nombre: 'Fisica I', estado: 'APROBADA', nota: 7, nivel: 1 }
            ]
        }] as any;

        mockMatriculacionService.getMisCarrerasMaterias.and.returnValue(of(historyMock));
        mockMatriculacionService.getHistorialMateria.and.returnValue(of({ nombreMateria: 'Test', finales: [], cursadas: [] }));
        mockMatriculacionService.getNotasCursada.and.returnValue(of([]));

        await render(AcademicStatusComponent, {
            providers: [
                { provide: MatriculacionService, useValue: mockMatriculacionService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        await waitFor(() => {
            expect(screen.getByText('Matematica')).toBeTruthy();
            expect(screen.getByText('Fisica I')).toBeTruthy();
        });
    });
});
