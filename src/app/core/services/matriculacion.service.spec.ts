import { TestBed } from '@angular/core/testing';
import { MatriculacionService } from './matriculacion.service';
import axiosClient from '@core/api/axios.client';
import { CarreraMateriasDTO } from '@core/models/carrera-materias.models';

describe('MatriculacionService', () => {
    let service: MatriculacionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MatriculacionService]
        });

        spyOn(axiosClient, 'get');

        service = TestBed.inject(MatriculacionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should getMisCarrerasMaterias', (done) => {
        const mockData: CarreraMateriasDTO[] = [{ idCarrera: '1', nombreCarrera: 'C1', idFacultad: 'f1', nombreFacultad: 'Facultad 1', nombrePlan: 'Plan 2024', materias: [] }];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockData }));

        service.getMisCarrerasMaterias().subscribe(data => {
            expect(data).toEqual(mockData);
            expect(axiosClient.get).toHaveBeenCalledWith('/alumnos/mis-carreras-materias');
            done();
        });
    });

    it('should getHistorialMateria', (done) => {
        const mockData = { idMateria: 'm1' } as any;
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockData }));

        service.getHistorialMateria('m1').subscribe(data => {
            expect(data).toEqual(mockData);
            expect(axiosClient.get).toHaveBeenCalledWith('/alumnos/mis-carreras-materias/historial/m1');
            done();
        });
    });

    it('should getNotasCursada', (done) => {
        const mockData = [{ nota: 8 }] as any;
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockData }));

        service.getNotasCursada('a1', 'm1').subscribe(data => {
            expect(data).toEqual(mockData);
            expect(axiosClient.get).toHaveBeenCalledWith('/inscripciones-cursado/alumno/a1/materia/m1/notas');
            done();
        });
    });
});
