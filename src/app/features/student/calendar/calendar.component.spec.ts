import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { CalendarioService } from '@core/services/calendario.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CalendarComponent', () => {
    let component: CalendarComponent;
    let fixture: ComponentFixture<CalendarComponent>;
    let calendarioService: jasmine.SpyObj<CalendarioService>;

    beforeEach(async () => {
        const calendarioSpy = jasmine.createSpyObj('CalendarioService', ['getCalendarioPdf']);

        await TestBed.configureTestingModule({
            imports: [CalendarComponent, NoopAnimationsModule],
            providers: [
                { provide: CalendarioService, useValue: calendarioSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.componentInstance;
        calendarioService = TestBed.inject(CalendarioService) as jasmine.SpyObj<CalendarioService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
