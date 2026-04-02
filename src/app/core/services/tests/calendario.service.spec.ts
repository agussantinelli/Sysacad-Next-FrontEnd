import { TestBed } from '@angular/core/testing';
import { CalendarioService } from '../calendario.service';
import axiosClient from '@core/api/axios.client';

describe('CalendarioService', () => {
    let service: CalendarioService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CalendarioService]
        });

        spyOn(axiosClient, 'get');

        service = TestBed.inject(CalendarioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should getCalendarioPdf', (done) => {
        const mockBlob = new Blob(['test'], { type: 'application/pdf' });
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockBlob }));

        service.getCalendarioPdf().subscribe(data => {
            expect(data).toEqual(mockBlob);
            expect(axiosClient.get).toHaveBeenCalledWith('/calendario', jasmine.objectContaining({ responseType: 'blob' }));
            done();
        });
    });
});

