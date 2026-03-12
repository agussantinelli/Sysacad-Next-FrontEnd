import { TestBed } from '@angular/core/testing';
import { AvisoService } from './aviso.service';
import axiosClient from '@core/api/axios.client';
import { AvisoRequest, AvisoResponse } from '@core/models/aviso.models';

describe('AvisoService', () => {
    let service: AvisoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AvisoService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        spyOn(axiosClient, 'put');

        service = TestBed.inject(AvisoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should crearAviso', (done) => {
        const mockRequest: AvisoRequest = { titulo: 'Test', contenido: 'Test Content', tipo: 'GENERAL' };
        const mockResponse: AvisoResponse = { id: '1', ...mockRequest, fecha: '2024-01-01', leido: false };
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.crearAviso(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/avisos', mockRequest);
            done();
        });
    });

    it('should listarAvisos', (done) => {
        const mockAvisos: AvisoResponse[] = [{ id: '1', titulo: 'Test', contenido: 'Test Content', tipo: 'GENERAL', fecha: '2024-01-01', leido: false }];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockAvisos }));

        service.listarAvisos().subscribe(data => {
            expect(data).toEqual(mockAvisos);
            expect(axiosClient.get).toHaveBeenCalledWith('/avisos');
            done();
        });
    });

    it('should marcarLeido', (done) => {
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

        service.marcarLeido('1').subscribe(() => {
            expect(axiosClient.post).toHaveBeenCalledWith('/avisos/1/leido');
            done();
        });
    });

    it('should obtenerCantidadSinLeer', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: 5 }));

        service.obtenerCantidadSinLeer().subscribe(data => {
            expect(data).toBe(5);
            expect(axiosClient.get).toHaveBeenCalledWith('/avisos/sin-leer/cantidad');
            done();
        });
    });

    it('should cambiarEstado', (done) => {
        const mockResponse: AvisoResponse = { id: '1', titulo: 'Test', contenido: 'Test Content', tipo: 'GENERAL', fecha: '2024-01-01', leido: false };
        (axiosClient.put as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.cambiarEstado('1', 'ACTIVO').subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.put).toHaveBeenCalledWith('/avisos/1/estado', {}, jasmine.objectContaining({ params: { nuevoEstado: 'ACTIVO' } }));
            done();
        });
    });
});
