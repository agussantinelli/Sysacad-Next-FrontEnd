import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyInscriptionsComponent } from './my-inscriptions.component';
import { InscripcionExamenService } from '@core/services/inscripcion-examen.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
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
});
