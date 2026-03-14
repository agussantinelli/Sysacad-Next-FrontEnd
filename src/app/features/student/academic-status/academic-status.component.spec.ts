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
});
