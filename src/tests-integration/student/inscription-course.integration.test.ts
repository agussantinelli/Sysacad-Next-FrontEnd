/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { InscriptionCourseComponent } from '@features/student/inscription-course/inscription-course.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { of, BehaviorSubject } from 'rxjs';

describe('Inscription Course Integration', () => {
    let mockInscripcionService: jasmine.SpyObj<InscripcionCursadoService>;
    let mockMatriculacionService: jasmine.SpyObj<MatriculacionService>;
    let mockAlertService: jasmine.SpyObj<AlertService>;
    let mockAuthService: any;
    const currentUserSubject = new BehaviorSubject({ id: 'u1', nombre: 'Test Student' });

    beforeEach(() => {
        mockInscripcionService = jasmine.createSpyObj('InscripcionCursadoService', ['getComisionesDisponibles', 'inscribirCursado']);
        mockMatriculacionService = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias']);
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'info', 'clear']);
        mockAuthService = {
            currentUser$: currentUserSubject.asObservable()
        };
    });

    it('should complete inscription flow', async () => {
        const materiasMock = [{ 
            nombreCarrera: 'Sistemas',
            nombrePlan: 'Plan 2023',
            materias: [{ idMateria: 'm1', nombre: 'Bases de Datos', sePuedeInscribir: true, esElectiva: false, nivel: 1, estado: 'PENDIENTE' }] 
        }] as any;

        mockMatriculacionService.getMisCarrerasMaterias.and.returnValue(of(materiasMock));
        mockInscripcionService.getComisionesDisponibles.and.returnValue(of([
            { idComision: 'c1', nombreComision: 'C1', modalidad: 'Presencial', horarios: ['Lun 08-12'], profesores: [], habilitada: true }
        ] as any));
        mockInscripcionService.inscribirCursado.and.returnValue(of({ success: true } as any));

        const { fixture } = await render(InscriptionCourseComponent, {
            providers: [
                { provide: MatriculacionService, useValue: mockMatriculacionService },
                { provide: InscripcionCursadoService, useValue: mockInscripcionService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: AlertService, useValue: mockAlertService }
            ]
        });

        fixture.detectChanges();

        await waitFor(() => expect(screen.getByText('Bases de Datos')).toBeTruthy());
        
        const inscribirBtn = screen.getByRole('button', { name: /Inscribirse/i });
        fireEvent.click(inscribirBtn);

        await waitFor(() => expect(screen.getByText('C1')).toBeTruthy());
        
        // En el modal, se hace click en la card de la comisión
        const commissionCard = screen.getByText('C1').closest('.commission-card');
        if (commissionCard) fireEvent.click(commissionCard);

        const confirmBtn = await screen.findByRole('button', { name: /Confirmar Definitivamente/i });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockInscripcionService.inscribirCursado).toHaveBeenCalled();
            expect(mockAlertService.success).toHaveBeenCalledWith('Inscripción realizada con éxito!');
        });
    });
});
