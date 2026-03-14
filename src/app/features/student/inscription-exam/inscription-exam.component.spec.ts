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
});
