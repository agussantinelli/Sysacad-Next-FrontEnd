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

    it('should initialize with light theme if saved in localStorage', () => {
        (localStorage.getItem as jasmine.Spy).and.returnValue('light');
        const lightService = new ThemeService();
        expect(lightService.isDarkMode()).toBeFalse();
        expect(document.body.classList.contains('dark-mode')).toBeFalse();
    });

    it('should apply dark-mode class to body on toggle', () => {
        service.toggleTheme();
        expect(document.body.classList.contains('dark-mode')).toBeTrue();
        service.toggleTheme();
        expect(document.body.classList.contains('dark-mode')).toBeFalse();
    });

    it('should maintain state consistency between isDarkMode and DOM', () => {
        expect(service.isDarkMode()).toBe(document.body.classList.contains('dark-mode'));
        service.toggleTheme();
        expect(service.isDarkMode()).toBe(document.body.classList.contains('dark-mode'));
    });

    it('should handle invalid theme in storage by defaulting to light', () => {
        (localStorage.getItem as jasmine.Spy).and.returnValue('invalid');
        const service2 = new ThemeService();
        expect(service2.isDarkMode()).toBeFalse();
    });

    it('should update body class even if toggleTheme is called multiple times', () => {
        service.toggleTheme(); // -> dark
        expect(document.body.classList.contains('dark-mode')).toBeTrue();
        service.toggleTheme(); // -> light
        expect(document.body.classList.contains('dark-mode')).toBeFalse();
        service.toggleTheme(); // -> dark
        expect(document.body.classList.contains('dark-mode')).toBeTrue();
    });

    it('should persist theme change to localStorage', () => {
        service.toggleTheme();
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
});
