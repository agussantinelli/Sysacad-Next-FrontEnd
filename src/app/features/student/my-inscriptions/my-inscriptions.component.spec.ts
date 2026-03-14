import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyInscriptionsComponent } from './my-inscriptions.component';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { AlertService } from '@core/services/alert.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MyInscriptionsComponent', () => {
    let component: MyInscriptionsComponent;
    let fixture: ComponentFixture<MyInscriptionsComponent>;
    let inscripcionService: jasmine.SpyObj<InscripcionExamenService>;

    beforeEach(async () => {
        const inscripcionSpy = jasmine.createSpyObj('InscripcionExamenService', ['misInscripciones', 'bajaInscripcion']);
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [MyInscriptionsComponent, NoopAnimationsModule],
            providers: [
                { provide: InscripcionExamenService, useValue: inscripcionSpy },
                { provide: AlertService, useValue: alertSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MyInscriptionsComponent);
        component = fixture.componentInstance;
        inscripcionService = TestBed.inject(InscripcionExamenService) as jasmine.SpyObj<InscripcionExamenService>;

        inscripcionService.misInscripciones.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load inscriptions on init', () => {
        const mockInscriptions = [{ idInscripcion: '1', nombreMateria: 'Math' }] as any;
        inscripcionService.misInscripciones.and.returnValue(of(mockInscriptions));
        
        component.ngOnInit();
        
        expect(inscripcionService.misInscripciones).toHaveBeenCalled();
        expect(component.myInscriptions).toEqual(mockInscriptions);
        expect(component.isLoading).toBeFalse();
    });

    it('should show confirmation modal on unenroll click', () => {
        component.onUnenrollClick('1');
        expect(component.showConfirmModal).toBeTrue();
        expect(component.inscriptionIdToUnenroll).toBe('1');
    });

    it('should confirm unenroll and reload data', () => {
        const alertService = TestBed.get(AlertService);
        inscripcionService.bajaInscripcion.and.returnValue(of(undefined));
        spyOn(component, 'loadMyInscriptions');
        
        component.inscriptionIdToUnenroll = '1';
        component.onConfirmUnenroll();
        
        expect(inscripcionService.bajaInscripcion).toHaveBeenCalledWith('1');
        expect(alertService.success).toHaveBeenCalledWith('Baja de inscripción exitosa.');
        expect(component.loadMyInscriptions).toHaveBeenCalled();
    });

    it('should cancel unenroll', () => {
        component.showConfirmModal = true;
        component.inscriptionIdToUnenroll = '1';
        component.onCancelUnenroll();
        expect(component.showConfirmModal).toBeFalse();
        expect(component.inscriptionIdToUnenroll).toBeNull();
    });
});
