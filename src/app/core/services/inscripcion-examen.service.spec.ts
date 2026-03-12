import { TestBed } from '@angular/core/testing';
import { InscripcionExamenService } from './inscripcion-examen.service';
import axiosClient from '@core/api/axios.client';
import { InscripcionExamenRequest, InscripcionExamenResponse } from '@core/models/inscripcion-examen.models';

describe('InscripcionExamenService', () => {
    let service: InscripcionExamenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InscripcionExamenService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        spyOn(axiosClient, 'delete');

        service = TestBed.inject(InscripcionExamenService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should inscribirExamen', (done) => {
        const mockRequest: InscripcionExamenRequest = { idMesaExamen: 'm1' };
        const mockResponse: InscripcionExamenResponse = { id: '1', idMesaExamen: 'm1' } as any;
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.inscribirExamen(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/inscripciones-examen', mockRequest);
            done();
        });
    });

    it('should misInscripciones', (done) => {
        const mockInscripciones: InscripcionExamenResponse[] = [{ id: '1' } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockInscripciones }));

        service.misInscripciones().subscribe(data => {
            expect(data).toEqual(mockInscripciones);
            expect(axiosClient.get).toHaveBeenCalledWith('/inscripciones-examen/mis-inscripciones');
            done();
        });
    });

    it('should bajaInscripcion', (done) => {
        (axiosClient.delete as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

        service.bajaInscripcion('1').subscribe(() => {
            expect(axiosClient.delete).toHaveBeenCalledWith('/inscripciones-examen/1');
            done();
        });
    });

    it('should calificarExamen', (done) => {
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

        service.calificarExamen('1', { nota: 8 }).subscribe(() => {
            expect(axiosClient.post).toHaveBeenCalledWith('/inscripciones-examen/1/calificar', { nota: 8 });
            done();
        });
    });
});
