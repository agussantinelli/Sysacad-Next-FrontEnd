import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionExamComponent } from './inscription-exam.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { MesaExamenService } from '@core/services/mesa-examen.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InscriptionExamComponent', () => {
    let component: InscriptionExamComponent;
    let fixture: ComponentFixture<InscriptionExamComponent>;
    let matriculacionService: jasmine.SpyObj<MatriculacionService>;

    beforeEach(async () => {
        const matriculacionSpy = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias']);
        const inscripcionSpy = jasmine.createSpyObj('InscripcionExamenService', ['inscribirExamen']);
        const mesaSpy = jasmine.createSpyObj('MesaExamenService', ['listarMesasPorMateria']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1' } as any)
        });
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'clear']);

        await TestBed.configureTestingModule({
            imports: [InscriptionExamComponent, NoopAnimationsModule],
            providers: [
                { provide: MatriculacionService, useValue: matriculacionSpy },
                { provide: InscripcionExamenService, useValue: inscripcionSpy },
                { provide: MesaExamenService, useValue: mesaSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: AlertService, useValue: alertSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(InscriptionExamComponent);
        component = fixture.componentInstance;
        matriculacionService = TestBed.inject(MatriculacionService) as jasmine.SpyObj<MatriculacionService>;

        matriculacionService.getMisCarrerasMaterias.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load materias and set conditions correctly', () => {
        const mockData = [{
            nombreCarrera: 'Sistemas',
            materias: [
                { nombre: 'M1', estado: 'REGULAR', tieneInscripcionExamenPendiente: false },
                { nombre: 'Inglés I', estado: 'PENDIENTE', tieneInscripcionExamenPendiente: false },
                { nombre: 'M2', estado: 'APROBADA', tieneInscripcionExamenPendiente: false },
                { nombre: 'M3', estado: 'REGULAR', tieneInscripcionExamenPendiente: true }
            ]
        }] as any;
        matriculacionService.getMisCarrerasMaterias.and.returnValue(of(mockData));
        
        component.loadMaterias();
        
        expect(component.carreras[0].materias[0].sePuedeInscribir).toBeTrue(); // Regular
        expect(component.carreras[0].materias[1].sePuedeInscribir).toBeTrue(); // Ingles
        expect(component.carreras[0].materias[2].sePuedeInscribir).toBeFalse(); // Approved
        expect(component.carreras[0].materias[3].sePuedeInscribir).toBeFalse(); // Pending inscription
    });

    it('should handle "inscribirse" action', () => {
        const mesaService = TestBed.get(MesaExamenService);
        const alertService = TestBed.get(AlertService);
        const mockMesas = [{ idDetalleMesa: 'D1', nroDetalle: 1, fecha: '2024-05-20' }] as any;
        
        mesaService.listarMesasPorMateria.and.returnValue(of(mockMesas));
        
        component.handleAction({ action: 'inscribirse', row: { idMateria: 'M1', nombre: 'Test' } });
        
        expect(mesaService.listarMesasPorMateria).toHaveBeenCalledWith('M1');
        expect(component.showTableSelectionModal).toBeTrue();
        expect(component.availableExamTables).toEqual(mockMesas);
    });

    it('should confirm enrollment successfully', () => {
        const inscripService = TestBed.get(InscripcionExamenService);
        const alertService = TestBed.get(AlertService);
        
        component.selectedMateriaForEnrollment = { idMateria: 'M1', nombre: 'M1' };
        component.selectedExamTable = { idDetalleMesa: 'D1', nroDetalle: 1 } as any;
        
        inscripService.inscribirExamen.and.returnValue(of({ success: true }));
        spyOn(component, 'loadMaterias');
        
        component.onConfirmEnrollment();
        
        expect(inscripService.inscribirExamen).toHaveBeenCalled();
        expect(alertService.success).toHaveBeenCalled();
        expect(component.loadMaterias).toHaveBeenCalled();
    });

    it('should apply filters correctly', () => {
        component.originalCarreras = [{
            materias: [
                { nombre: 'Math', estado: 'REGULAR', tipo: 'Obligatoria', nivel: 1 },
                { nombre: 'Physics', estado: 'PENDIENTE', tipo: 'Electiva', nivel: 2 }
            ]
        }] as any;

        component.filterNombre = 'Math';
        component.onMateriaChange();
        expect(component.carreras[0].materias.length).toBe(1);
        expect(component.carreras[0].materias[0].nombre).toBe('Math');
    });
});
