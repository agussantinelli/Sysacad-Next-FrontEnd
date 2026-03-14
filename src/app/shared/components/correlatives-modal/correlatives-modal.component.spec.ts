import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrelativesModalComponent } from './correlatives-modal.component';

describe('CorrelativesModalComponent', () => {
    let component: CorrelativesModalComponent;
    let fixture: ComponentFixture<CorrelativesModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CorrelativesModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CorrelativesModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
