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

    it('should load and process enrollment data on init', () => {
        const mockData = [{
            nombreMateria: 'M1',
            nombreComision: 'C1',
            calificaciones: [{ descripcion: 'P1', nota: 8 }]
        }] as any;
        inscripcionService.obtenerCursadasActuales.and.returnValue(of(mockData));
        
        component.ngOnInit();
        
        expect(inscripcionService.obtenerCursadasActuales).toHaveBeenCalledWith('1');
        expect(component.displayData.length).toBe(1);
        expect(component.displayData[0].calificacionesList[0]).toBe('P1: 8');
    });

    it('should handle missing user identified', () => {
        (Object.getOwnPropertyDescriptor(authService, 'currentUser$')?.get as jasmine.Spy).and.returnValue(of(null));
        spyOn(console, 'error');
        
        component.loadData();
        
        expect(console.error).toHaveBeenCalledWith('User not identified');
        expect(component.isLoading).toBeFalse();
    });

    it('should handle empty grades list', () => {
        const mockData = [{
            nombreMateria: 'M2',
            calificaciones: []
        }] as any;
        inscripcionService.obtenerCursadasActuales.and.returnValue(of(mockData));
        
        component.loadData();
        
        expect(component.displayData[0].calificacionesList).toEqual([]);
    });
});
