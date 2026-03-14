import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentEnrollmentsComponent } from './current-enrollments.component';
import { InscripcionCursadoService } from '@core/services/inscripcion-cursado.service';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CurrentEnrollmentsComponent', () => {
    let component: CurrentEnrollmentsComponent;
    let fixture: ComponentFixture<CurrentEnrollmentsComponent>;
    let inscripcionService: jasmine.SpyObj<InscripcionCursadoService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const inscripcionSpy = jasmine.createSpyObj('InscripcionCursadoService', ['obtenerCursadasActuales']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1' } as any)
        });

        await TestBed.configureTestingModule({
            imports: [CurrentEnrollmentsComponent, NoopAnimationsModule],
            providers: [
                { provide: InscripcionCursadoService, useValue: inscripcionSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CurrentEnrollmentsComponent);
        component = fixture.componentInstance;
        inscripcionService = TestBed.inject(InscripcionCursadoService) as jasmine.SpyObj<InscripcionCursadoService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        inscripcionService.obtenerCursadasActuales.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
