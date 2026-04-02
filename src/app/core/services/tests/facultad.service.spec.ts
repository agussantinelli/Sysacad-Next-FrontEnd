import { TestBed } from '@angular/core/testing';
import { FacultadService } from '../facultad.service';
import axiosClient from '@core/api/axios.client';
import { FacultadRequest, FacultadResponse } from '@core/models/facultad.models';

describe('FacultadService', () => {
    let service: FacultadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FacultadService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');

        service = TestBed.inject(FacultadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should crearFacultad', (done) => {
        const mockRequest: FacultadRequest = { ciudad: 'Ciudad 1', provincia: 'Provincia 1' };
        const mockResponse: FacultadResponse = { id: '1', ...mockRequest, nombreCompleto: 'Facultad Ciudad 1' };
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.crearFacultad(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/facultades', mockRequest);
            done();
        });
    });

    it('should listarTodas', (done) => {
        const mockFacultades: FacultadResponse[] = [{ id: '1', ciudad: 'Ciudad 1', provincia: 'Provincia 1', nombreCompleto: 'Facultad Ciudad 1' }];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockFacultades }));

        service.listarTodas().subscribe(data => {
            expect(data).toEqual(mockFacultades);
            expect(axiosClient.get).toHaveBeenCalledWith('/facultades');
            done();
        });
    });

    it('should buscarPorId', (done) => {
        const mockFacultad: FacultadResponse = { id: '1', ciudad: 'Ciudad 1', provincia: 'Provincia 1', nombreCompleto: 'Facultad Ciudad 1' };
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockFacultad }));

        service.buscarPorId('1').subscribe(data => {
            expect(data).toEqual(mockFacultad);
            expect(axiosClient.get).toHaveBeenCalledWith('/facultades/1');
            done();
        });
    });
});

