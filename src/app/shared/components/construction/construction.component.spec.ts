import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructionComponent } from './construction.component';
import { AlertService } from '@core/services/alert.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConstructionComponent', () => {
    let component: ConstructionComponent;
    let fixture: ComponentFixture<ConstructionComponent>;

    beforeEach(async () => {
        const alertSpy = jasmine.createSpyObj('AlertService', ['clear']);

        await TestBed.configureTestingModule({
            imports: [ConstructionComponent, NoopAnimationsModule],
            providers: [
                { provide: AlertService, useValue: alertSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConstructionComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
