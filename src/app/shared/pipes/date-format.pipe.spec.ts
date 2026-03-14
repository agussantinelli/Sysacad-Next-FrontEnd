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
});
