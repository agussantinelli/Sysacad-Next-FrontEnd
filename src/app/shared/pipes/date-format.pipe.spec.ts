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
        expect(pipe.transform('2023-05-20')).toBe('20/05/2023');
    });

    it('should handle single digit days and months', () => {
        const date = new Date(2023, 4, 5); // May 5th 2023
        expect(pipe.transform(date)).toBe('05/05/2023');
    });

    it('should return empty string for invalid dates', () => {
        expect(pipe.transform('invalid-date')).toBe('');
    });

    it('should handle leap years correctly', () => {
        const date = new Date(2024, 1, 29); // Feb 29th 2024
        expect(pipe.transform(date)).toBe('29/02/2024');
    });

    it('should handle year rollover', () => {
        const date = new Date(2023, 11, 31); // Dec 31st 2023
        expect(pipe.transform(date)).toBe('31/12/2023');
    });
});
