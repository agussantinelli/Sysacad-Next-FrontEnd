import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            if (key === 'theme') return null;
            return null;
        });
        spyOn(localStorage, 'setItem');
        
        TestBed.configureTestingModule({
            providers: [ThemeService]
        });
        service = TestBed.inject(ThemeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should default to light mode', () => {
        expect(service.isDarkMode()).toBeFalse();
    });

    it('should toggle theme', () => {
        service.toggleTheme();
        expect(service.isDarkMode()).toBeTrue();
        expect(document.body.classList.contains('dark-mode')).toBeTrue();
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

        service.toggleTheme();
        expect(service.isDarkMode()).toBeFalse();
        expect(document.body.classList.contains('dark-mode')).toBeFalse();
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should initialize with dark theme if saved in localStorage', () => {
        (localStorage.getItem as jasmine.Spy).and.returnValue('dark');
        const darkService = new ThemeService();
        expect(darkService.isDarkMode()).toBeTrue();
        expect(document.body.classList.contains('dark-mode')).toBeTrue();
    });
});
