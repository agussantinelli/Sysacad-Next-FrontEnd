import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionModalComponent } from './inscription-modal.component';

describe('InscriptionModalComponent', () => {
    let component: InscriptionModalComponent;
    let fixture: ComponentFixture<InscriptionModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InscriptionModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(InscriptionModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
