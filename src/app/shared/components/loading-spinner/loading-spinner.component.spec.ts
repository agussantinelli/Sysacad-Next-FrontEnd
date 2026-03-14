import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
    let component: LoadingSpinnerComponent;
    let fixture: ComponentFixture<LoadingSpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadingSpinnerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingSpinnerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should display default message', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Cargando...');
    });

    it('should display custom message', () => {
        component.message = 'Procesando...';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Procesando...');
    });

    it('should have full-screen class when fullScreen is true', () => {
        component.fullScreen = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.spinner-overlay')).toBeTruthy();
    });

    it('should have inline class when inline is true', () => {
        component.inline = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.inline')).toBeTruthy();
    });

    it('should NOT have fullscreen class by default', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.spinner-overlay')?.classList.contains('fullscreen')).toBeFalsy();
    });

    it('should NOT have inline class by default', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.spinner-overlay')?.classList.contains('inline')).toBeFalsy();
    });

    it('should update message dynamically', () => {
        fixture.detectChanges();
        component.message = 'New Message';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('New Message');
    });

    it('should support empty message', () => {
        component.message = '';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        // Should at least contain the spinner div
        expect(compiled.querySelector('.spinner')).toBeTruthy();
    });
});
