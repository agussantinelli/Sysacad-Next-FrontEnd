import { TestBed } from '@angular/core/testing';
import { ComisionService } from '../comision.service';
import axiosClient from '@core/api/axios.client';
import { ComisionRequest, ComisionResponse } from '@core/models/comision.models';

describe('ComisionService', () => {
    let service: ComisionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ComisionService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');

        service = TestBed.inject(ComisionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should crearComision', (done) => {
        const mockRequest: ComisionRequest = { nombre: 'C1', anio: 2024, idMateria: 'm1', idProfesor: 'p1', aula: 'A1', turno: 'MAÑANA' } as any;
        const mockResponse: ComisionResponse = { id: '1', ...mockRequest } as any;
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.crearComision(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/comisiones', mockRequest);
            done();
        });
    });

    it('should listarPorAnio', (done) => {
        const mockComisiones: ComisionResponse[] = [{ id: '1', nombre: 'C1', anio: 2024 } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockComisiones }));

        service.listarPorAnio(2024).subscribe(data => {
            expect(data).toEqual(mockComisiones);
            expect(axiosClient.get).toHaveBeenCalledWith('/comisiones', jasmine.objectContaining({ params: { anio: 2024 } }));
            done();
        });
    });

    it('should buscarPorId', (done) => {
        const mockComision: ComisionResponse = { id: '1', nombre: 'C1' } as any;
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockComision }));

        service.buscarPorId('1').subscribe(data => {
            expect(data).toEqual(mockComision);
            expect(axiosClient.get).toHaveBeenCalledWith('/comisiones/1');
            done();
        });
    });

    it('should asignarProfesor', (done) => {
        const mockResponse: ComisionResponse = { id: '1', nombre: 'C1' } as any;
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.asignarProfesor('1', { id: 'p1' }).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/comisiones/1/profesores', { id: 'p1' });
            done();
        });
    });
});

