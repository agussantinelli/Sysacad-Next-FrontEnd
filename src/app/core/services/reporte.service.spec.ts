import { TestBed } from '@angular/core/testing';
import { ReporteService } from './reporte.service';
import axiosClient from '@core/api/axios.client';

describe('ReporteService', () => {
    let service: ReporteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ReporteService]
        });

        spyOn(axiosClient, 'get');

        service = TestBed.inject(ReporteService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should getCertificadosHistory', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));

        service.getCertificadosHistory().subscribe(data => {
            expect(data).toEqual([]);
            expect(axiosClient.get).toHaveBeenCalledWith('/reportes/certificados');
            done();
        });
    });
});
