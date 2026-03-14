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

    it('should have success class when type is success', () => {
        component.type = 'success';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.alert-success')).toBeTruthy();
    });

    it('should have error class when type is error', () => {
        component.type = 'error';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.alert-error')).toBeTruthy();
    });

    it('should have warning class when type is warning', () => {
        component.type = 'warning';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.alert-warning')).toBeTruthy();
    });

    it('should have info class when type is info', () => {
        component.type = 'info';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.alert-info')).toBeTruthy();
    });

    it('should render icon in the DOM', () => {
        component.type = 'success';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const iconElement = compiled.querySelector('.material-icons');
        expect(iconElement?.textContent?.trim()).toBe('check_circle');
    });
});
