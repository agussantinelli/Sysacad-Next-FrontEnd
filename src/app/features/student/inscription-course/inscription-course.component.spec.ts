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
});
