/// <reference types="jasmine" />
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { InscriptionCourseComponent } from '@features/student/inscription-course/inscription-course.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { of, BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('Inscription Course Integration', () => {
    let mockInscripcionService: jasmine.SpyObj<InscripcionCursadoService>;
    let mockMatriculacionService: jasmine.SpyObj<MatriculacionService>;
    let mockAlertService: jasmine.SpyObj<AlertService>;
    let mockAuthService: any;

    beforeEach(() => {
        mockInscripcionService = jasmine.createSpyObj('InscripcionCursadoService', ['getComisionesDisponibles', 'inscribirCursado']);
        mockMatriculacionService = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias']);
        mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error', 'info', 'clear']);
        mockAuthService = {
            currentUser$: of({ id: 'u1', nombre: 'Test Student', rol: 'ESTUDIANTE' })
        };
    });

    it('should complete inscription flow', async () => {
        const materiasMock = [{ 
            nombreCarrera: 'Sistemas',
            nombrePlan: 'Plan 2023',
            materias: [{ 
                idMateria: 'm1', 
                nombre: 'Bases de Datos', 
                sePuedeInscribir: true, 
                esElectiva: false, 
                nivel: 1, 
                estado: 'PENDIENTE',
                tipo: 'Obligatoria'
            }] 
        }] as any;

        mockMatriculacionService.getMisCarrerasMaterias.and.returnValue(of(materiasMock));
        mockInscripcionService.getComisionesDisponibles.and.returnValue(of([
            { idComision: 'c1', nombre: 'C1', modalidad: 'Presencial', horarios: ['Lun 08-12'], profesores: [], habilitada: true }
        ] as any));
        mockInscripcionService.inscribirCursado.and.returnValue(of({ success: true } as any));

        await render(InscriptionCourseComponent, {
            imports: [FormsModule],
            providers: [
                { provide: MatriculacionService, useValue: mockMatriculacionService },
                { provide: InscripcionCursadoService, useValue: mockInscripcionService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: AlertService, useValue: mockAlertService }
            ]
        });

        await waitFor(() => expect(screen.getByText(/Bases de Datos/i, { selector: 'span' })).toBeTruthy());
        
        // El botón 'Inscribirse' está en TableComponent
        const inscribirBtn = screen.getByRole('button', { name: /Inscribirse/i });
        fireEvent.click(inscribirBtn);

        // En el modal, se elige la comisión
        await waitFor(() => expect(screen.getByText(/C1/i)).toBeTruthy());
        const commissionCard = screen.getByText(/C1/i).closest('.commission-card');
        if (commissionCard) fireEvent.click(commissionCard);
        
        // Confirmar en el modal de confirmación
        const confirmBtn = await screen.findByRole('button', { name: /Confirmar Definitivamente/i });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockInscripcionService.inscribirCursado).toHaveBeenCalled();
            expect(mockAlertService.success).toHaveBeenCalledWith('Inscripción realizada con éxito!');
        });
    });
});
