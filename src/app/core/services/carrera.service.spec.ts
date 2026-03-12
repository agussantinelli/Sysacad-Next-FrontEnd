import { TestBed } from '@angular/core/testing';
import { CarreraService } from './carrera.service';
import axiosClient from '@core/api/axios.client';
import { CarreraResponse } from '@core/models/carrera.models';
import { PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';

describe('CarreraService', () => {
    let service: CarreraService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CarreraService]
        });

        spyOn(axiosClient, 'get');

        service = TestBed.inject(CarreraService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should listarPorFacultad', (done) => {
        const mockCarreras: CarreraResponse[] = [{ id: '1', nombre: 'Carrera 1', duracionAnios: 5, idFacultad: 'f1' }];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockCarreras }));

        service.listarPorFacultad('f1').subscribe(data => {
            expect(data).toEqual(mockCarreras);
            expect(axiosClient.get).toHaveBeenCalledWith('/carreras/facultad/f1');
            done();
        });
    });

    it('should listarPlanesVigentes', (done) => {
        const mockPlanes: PlanDeEstudioResponse[] = [{ id: 'p1', anio: 2024, idCarrera: '1', descripcion: 'Plan 2024' } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockPlanes }));

        service.listarPlanesVigentes('1', 'f1').subscribe(data => {
            expect(data).toEqual(mockPlanes);
            expect(axiosClient.get).toHaveBeenCalledWith('/carreras/1/planes/vigentes', jasmine.objectContaining({ params: { idFacultad: 'f1' } }));
            done();
        });
    });
});
