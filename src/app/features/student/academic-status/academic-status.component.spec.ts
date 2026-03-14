import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcademicStatusComponent } from './academic-status.component';
import { MatriculacionService } from '@core/services/matriculacion.service';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AcademicStatusComponent', () => {
    let component: AcademicStatusComponent;
    let fixture: ComponentFixture<AcademicStatusComponent>;
    let matriculacionService: jasmine.SpyObj<MatriculacionService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const matriculacionSpy = jasmine.createSpyObj('MatriculacionService', ['getMisCarrerasMaterias', 'getHistorialMateria', 'getNotasCursada']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1' } as any)
        });

        await TestBed.configureTestingModule({
            imports: [AcademicStatusComponent, NoopAnimationsModule],
            providers: [
                { provide: MatriculacionService, useValue: matriculacionSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AcademicStatusComponent);
        component = fixture.componentInstance;
        matriculacionService = TestBed.inject(MatriculacionService) as jasmine.SpyObj<MatriculacionService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        matriculacionService.getMisCarrerasMaterias.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load and process data on init', () => {
        const mockData = [{
            materias: [
                { idMateria: '1', nombre: 'M1', estado: 'PENDIENTE', nivel: 1 },
                { idMateria: '2', nombre: 'M2', estado: 'REGULAR', nivel: 1 }
            ]
        }] as any;
        matriculacionService.getMisCarrerasMaterias.and.returnValue(of(mockData));
        
        component.ngOnInit();
        
        expect(component.displayData.length).toBe(1);
        expect(component.displayData[0].nombre).toBe('M2');
    });

    it('should handle ver-historial action', () => {
        const mockRow = { idMateria: 'M2', nombre: 'M2' };
        
        matriculacionService.getHistorialMateria.and.returnValue(of({ finales: [], cursadas: [] } as any));
        matriculacionService.getNotasCursada.and.returnValue(of([]));
        
        component.handleAction({ action: 'ver-historial', row: mockRow });
        
        expect(component.isModalOpen).toBeTrue();
        expect(component.selectedMateria).toBe(mockRow);
        expect(matriculacionService.getHistorialMateria).toHaveBeenCalledWith('M2');
    });

    it('should close modal', () => {
        component.isModalOpen = true;
        component.closeModal();
        expect(component.isModalOpen).toBeFalse();
        expect(component.selectedMateria).toBeNull();
    });
});
