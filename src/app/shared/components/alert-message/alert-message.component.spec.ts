import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertMessageComponent } from './alert-message.component';

describe('AlertMessageComponent', () => {
    let component: AlertMessageComponent;
    let fixture: ComponentFixture<AlertMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertMessageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertMessageComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should return correct icon based on type', () => {
        component.type = 'success';
        expect(component.icon).toBe('check_circle');

        component.type = 'error';
        expect(component.icon).toBe('error');

        component.type = 'warning';
        expect(component.icon).toBe('warning');

        component.type = 'info';
        expect(component.icon).toBe('info');
    });

    it('should emit close event on onClose', () => {
        spyOn(component.close, 'emit');
        component.onClose();
        expect(component.close.emit).toHaveBeenCalled();
    });

    it('should display the message', () => {
        component.message = 'Test Alert Message';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Test Alert Message');
    });
});
