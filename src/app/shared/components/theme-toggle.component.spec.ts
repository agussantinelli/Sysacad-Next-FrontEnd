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
});
