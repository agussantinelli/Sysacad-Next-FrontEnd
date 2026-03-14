import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '@core/services/theme.service';

describe('ThemeToggleComponent', () => {
    let component: ThemeToggleComponent;
    let fixture: ComponentFixture<ThemeToggleComponent>;

    beforeEach(async () => {
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode', 'toggleTheme']);

        await TestBed.configureTestingModule({
            imports: [ThemeToggleComponent],
            providers: [
                { provide: ThemeService, useValue: themeSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ThemeToggleComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should call toggleTheme on click', () => {
        const themeService = TestBed.inject(ThemeService);
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(themeService.toggleTheme).toHaveBeenCalled();
    });

    it('should apply dark class when in dark mode', () => {
        const themeService = TestBed.inject(ThemeService);
        (themeService.isDarkMode as any).and.returnValue(true);
        fixture.detectChanges();
        
        const button = fixture.nativeElement.querySelector('button');
        expect(button.classList.contains('dark')).toBeTrue();
    });

    it('should not apply dark class when in light mode', () => {
        const themeService = TestBed.inject(ThemeService);
        (themeService.isDarkMode as any).and.returnValue(false);
        fixture.detectChanges();
        
        const button = fixture.nativeElement.querySelector('button');
        expect(button.classList.contains('dark')).toBeFalse();
    });
});
