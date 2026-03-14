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

    it('should handle body overflow on lifecycle', () => {
        component.ngOnInit();
        expect(document.body.style.overflow).toBe('hidden');
        component.ngOnDestroy();
        expect(document.body.style.overflow).toBe('auto');
    });

    it('should emit confirm and close events', () => {
        spyOn(component.confirm, 'emit');
        spyOn(component.close, 'emit');
        
        component.onConfirm();
        expect(component.confirm.emit).toHaveBeenCalled();
        
        component.onClose();
        expect(component.close.emit).toHaveBeenCalled();
    });
});
