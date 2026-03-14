import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionConfirmationModalComponent } from './inscription-confirmation-modal.component';

describe('InscriptionConfirmationModalComponent', () => {
    let component: InscriptionConfirmationModalComponent;
    let fixture: ComponentFixture<InscriptionConfirmationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InscriptionConfirmationModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(InscriptionConfirmationModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
