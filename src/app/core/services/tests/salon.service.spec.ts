import { TestBed } from '@angular/core/testing';
import { SalonService } from '../salon.service';
import axiosClient from '@core/api/axios.client';
import { SalonRequest, SalonResponse } from '@core/models/salon.models';

describe('SalonService', () => {
    let service: SalonService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SalonService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');

        service = TestBed.inject(SalonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should crearSalon', (done) => {
        const mockRequest: SalonRequest = { idFacultad: 'f1', nombre: 'Salon 1', piso: '1' };
        const mockResponse: SalonResponse = { id: '1', idFacultad: 'f1', nombreFacultad: 'Facultad 1', nombre: 'Salon 1', piso: '1', capacidad: 30 };
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.crearSalon(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/salones', mockRequest);
            done();
        });
    });

    it('should listarSalonesFacultad', (done) => {
        const mockSalones: SalonResponse[] = [{ id: '1', idFacultad: 'f1', nombreFacultad: 'Facultad 1', nombre: 'Salon 1', piso: '1', capacidad: 30 }];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockSalones }));

        service.listarSalonesFacultad('f1').subscribe(data => {
            expect(data).toEqual(mockSalones);
            expect(axiosClient.get).toHaveBeenCalledWith('/salones/facultad/f1');
            done();
        });
    });
});

