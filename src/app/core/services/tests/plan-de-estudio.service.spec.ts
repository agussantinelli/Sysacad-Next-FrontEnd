import { TestBed } from '@angular/core/testing';
import { PlanDeEstudioService, PlanMateriaRequest } from '../plan-de-estudio.service';
import axiosClient from '@core/api/axios.client';
import { PlanDeEstudioRequest, PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';

describe('PlanDeEstudioService', () => {
    let service: PlanDeEstudioService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PlanDeEstudioService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');

        service = TestBed.inject(PlanDeEstudioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should crearPlan', (done) => {
        const mockRequest: PlanDeEstudioRequest = { anio: 2024, idCarrera: '1', descripcion: 'Test Plan' } as any;
        const mockResponse: PlanDeEstudioResponse = { id: '1', ...mockRequest } as any;
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.crearPlan(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/planes', mockRequest);
            done();
        });
    });

    it('should agregarMateriaAPlan', (done) => {
        const mockRequest: PlanMateriaRequest = { idFacultad: 'f1', idCarrera: 'c1', nombrePlan: 'P1', idMateria: 'm1', cuatrimestre: 1 };
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

        service.agregarMateriaAPlan(mockRequest).subscribe(() => {
            expect(axiosClient.post).toHaveBeenCalledWith('/planes/materias', mockRequest);
            done();
        });
    });

    it('should listarPlanesVigentes', (done) => {
        const mockPlanes: PlanDeEstudioResponse[] = [{ id: '1', anio: 2024 } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockPlanes }));

        service.listarPlanesVigentes('c1').subscribe(data => {
            expect(data).toEqual(mockPlanes);
            expect(axiosClient.get).toHaveBeenCalledWith('/planes/vigentes/c1');
            done();
        });
    });

    it('should listarTodosPorCarrera', (done) => {
        const mockPlanes: PlanDeEstudioResponse[] = [{ id: '1', anio: 2024 } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockPlanes }));

        service.listarTodosPorCarrera('c1').subscribe(data => {
            expect(data).toEqual(mockPlanes);
            expect(axiosClient.get).toHaveBeenCalledWith('/planes/carrera/c1');
            done();
        });
    });
});

