import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionCourseComponent } from './inscription-course.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { ComisionService } from '@core/services/comision.service';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InscriptionCourseComponent', () => {
    let component: InscriptionCourseComponent;
    let fixture: ComponentFixture<InscriptionCourseComponent>;
    let matriculacionService: jasmine.SpyObj<MatriculacionService>;

    beforeEach(async () => {
        const matriculacionSpy = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias']);
        const comisionSpy = jasmine.createSpyObj('ComisionService', ['getComisionesByMateria']);
        const inscripcionSpy = jasmine.createSpyObj('InscripcionCursadoService', ['getComisionesDisponibles', 'inscribirCursado']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1' } as any)
        });
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'clear']);

        await TestBed.configureTestingModule({
            imports: [InscriptionCourseComponent, NoopAnimationsModule],
            providers: [
                { provide: MatriculacionService, useValue: matriculacionSpy },
                { provide: ComisionService, useValue: comisionSpy },
                { provide: InscripcionCursadoService, useValue: inscripcionSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: AlertService, useValue: alertSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(InscriptionCourseComponent);
        component = fixture.componentInstance;
        matriculacionService = TestBed.inject(MatriculacionService) as jasmine.SpyObj<MatriculacionService>;

        matriculacionService.getMisCarrerasMaterias.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load materias and block electives correctly', () => {
        const mockData = [{
            nombreCarrera: 'Sistemas',
            materias: [
                { idMateria: '1', nombre: 'M1', nivel: 1, estado: 'PENDIENTE', esElectiva: false, sePuedeInscribir: true },
                { idMateria: '2', nombre: 'M2', nivel: 2, estado: 'PENDIENTE', esElectiva: true, sePuedeInscribir: true }
            ]
        }] as any;
        matriculacionService.getMisCarrerasMaterias.and.returnValue(of(mockData));
        
        component.loadMaterias();
        
        expect(component.carreras[0].materias[1].sePuedeInscribir).toBeFalse(); // Blocked level 2 elective because level 1 is not regular/approved
    });

    it('should apply filters correctly', () => {
        component.originalCarreras = [{
            nombreCarrera: 'Sistemas',
            materias: [
                { nombre: 'Materia 1', estado: 'PENDIENTE', tipo: 'Obligatoria', nivel: 1 },
                { nombre: 'Materia 2', estado: 'APROBADA', tipo: 'Electiva', nivel: 2 }
            ]
        }] as any;

        component.filterEstado = 'APROBADA';
        component.applyFilters();
        expect(component.carreras[0].materias.length).toBe(1);
        expect(component.carreras[0].materias[0].nombre).toBe('Materia 2');
    });

    it('should open commission modal on action', () => {
        const inscripService = TestBed.inject(InscripcionCursadoService);
        const alertService = TestBed.inject(AlertService);
        const mockComms = [{ idComision: 'C1', nombreComision: 'Com 1' }] as any;
        
        (inscripService.getComisionesDisponibles as jasmine.Spy).and.returnValue(of(mockComms));
        
        component.handleAction({ action: 'inscribirse', row: { idMateria: 'M1' } });
        
        expect(inscripService.getComisionesDisponibles).toHaveBeenCalled();
        expect(component.showCommissionModal).toBeTrue();
        expect(component.availableCommissions).toEqual(mockComms);
    });

    it('should handle enrollment success', () => {
        const inscripService = TestBed.inject(InscripcionCursadoService);
        const alertService = TestBed.inject(AlertService);
        
        component.selectedMateriaForEnrollment = { idMateria: 'M1' };
        component.selectedCommissionForConfirmation = { idComision: 'C1' } as any;
        (inscripService.inscribirCursado as jasmine.Spy).and.returnValue(of({ success: true } as any));
        spyOn(component, 'loadMaterias');
        
        component.confirmEnrollment();
        
        expect(inscripService.inscribirCursado).toHaveBeenCalled();
        expect(alertService.success).toHaveBeenCalledWith('Inscripción realizada con éxito!');
        expect(component.loadMaterias).toHaveBeenCalled();
    });
});
