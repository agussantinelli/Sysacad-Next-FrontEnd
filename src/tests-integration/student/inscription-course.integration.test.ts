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
            { idComision: 'c1', nombreComision: 'C1', modalidad: 'Presencial', horarios: ['Lun 08-12'], profesores: [], habilitada: true }
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

        // Esperar a que la tabla se renderice buscando una columna de la tabla
        await waitFor(() => expect(screen.getByRole('columnheader', { name: /Estado/i })).toBeTruthy());
        
        // El botón 'Inscribirse' está en TableComponent
        const inscribirBtn = (await screen.findAllByRole('button', { name: /Inscribirse/i }))[0];
        fireEvent.click(inscribirBtn);

        // En el modal, se elige la comisión
        const commissionCard = await screen.findByLabelText('C1');
        fireEvent.click(commissionCard);

        // Click en el botón intermedio para ir al modal de confirmación
        const nextModalBtn = await screen.findByRole('button', { name: 'Confirmar Selección' });
        fireEvent.click(nextModalBtn);
        
        // Confirmar en el modal de confirmación
        const confirmBtn = await screen.findByRole('button', { name: 'Confirmar Definitivamente' });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockInscripcionService.inscribirCursado).toHaveBeenCalled();
            expect(mockAlertService.success).toHaveBeenCalledWith('Inscripción realizada con éxito!');
        });
    });
});
