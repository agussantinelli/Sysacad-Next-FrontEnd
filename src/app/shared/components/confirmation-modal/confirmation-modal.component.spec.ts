import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
    let component: ConfirmationModalComponent;
    let fixture: ComponentFixture<ConfirmationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmationModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should set body overflow to hidden on init and auto on destroy', () => {
        component.ngOnInit();
        expect(document.body.style.overflow).toBe('hidden');

        component.ngOnDestroy();
        expect(document.body.style.overflow).toBe('auto');
    });

    it('should emit confirm event on onConfirm', () => {
        spyOn(component.confirm, 'emit');
        component.onConfirm();
        expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should emit close event on onClose', () => {
        spyOn(component.close, 'emit');
        component.onClose();
        expect(component.close.emit).toHaveBeenCalled();
    });

    it('should display inputs correctly', () => {
        component.title = 'Custom Title';
        component.message = 'Custom Message';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h3')?.textContent).toContain('Custom Title');
        expect(compiled.querySelector('p')?.textContent).toContain('Custom Message');
    });
});
