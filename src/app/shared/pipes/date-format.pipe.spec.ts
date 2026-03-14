import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
    let pipe: DateFormatPipe;

    beforeEach(() => {
        pipe = new DateFormatPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format date correctly', () => {
        const date = new Date(2023, 0, 1); // Jan 1st 2023
        expect(pipe.transform(date)).toBe('01/01/2023');
    });

    it('should return empty string for null/undefined', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should format string dates correctly', () => {
        // Use a format that doesn't trigger UTC parsing to avoid TZ issues
        expect(pipe.transform('2023/05/20')).toBe('20/05/2023');
    });

    it('should handle single digit days and months', () => {
        const date = new Date(2023, 4, 5); // May 5th 2023
        expect(pipe.transform(date)).toBe('05/05/2023');
    });

    it('should return input string for invalid dates', () => {
        expect(pipe.transform('invalid-date')).toBe('invalid-date');
    });

    it('should handle leap years correctly', () => {
        const date = new Date(2024, 1, 29); // Feb 29th 2024
        expect(pipe.transform(date)).toBe('29/02/2024');
    });

    it('should handle year rollover', () => {
        const date = new Date(2023, 11, 31); // Dec 31st 2023
        expect(pipe.transform(date)).toBe('31/12/2023');
    });

    it('should handle ISO strings by ensuring they are treated as local time', () => {
        // Using a format that is more likely to be parsed as local or specifying full components
        const dateStr = '2023-05-20T12:00:00'; 
        expect(pipe.transform(dateStr)).toBe('20/05/2023');
    });
});
