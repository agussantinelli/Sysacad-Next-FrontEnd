import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import axiosClient from '@core/api/axios.client';
import { of } from 'rxjs';
import { AdminInscripcionDTO, AdminEstadisticasDTO } from '@core/models/admin.models';

describe('AdminService', () => {
    let service: AdminService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AdminService]
        });

        // Mock axiosClient methods
        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        spyOn(axiosClient, 'delete');
        spyOn(axiosClient, 'put');

        service = TestBed.inject(AdminService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('obtenerInscripciones', () => {
        it('should return inscriptions from API', (done) => {
            const mockInscripciones: AdminInscripcionDTO[] = [
                { id: '1', nombre: 'Test', apellido: 'User', nombreMateria: 'Math', tipo: 'CURSADA', fechaInscripcion: '2024-01-01', legajoAlumno: '123', idAlumno: 'a1', comision: 'C1', estado: 'ACTIVO' }
            ];
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockInscripciones }));

            service.obtenerInscripciones().subscribe(data => {
                expect(data).toEqual(mockInscripciones);
                expect(axiosClient.get).toHaveBeenCalledWith('/admin/inscripciones');
                done();
            });
        });
    });

    describe('obtenerEstadisticas', () => {
        it('should call API with correct parameters', (done) => {
            const mockEstadisticas: AdminEstadisticasDTO = {
                alumnosActivos: 100,
                materiasVigentes: 10,
                mensajesTotales: 50,
                // Add other required fields from ProfesorEstadisticasDTO if needed
                promedioGeneral: 8,
                totalExamenes: 10,
                aprobados: 8,
                desaprobados: 2,
                asistenciaPromedio: 90
            } as any;
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockEstadisticas }));

            service.obtenerEstadisticas(2024, 'Facultad A', 'Carrera B').subscribe(data => {
                expect(data).toEqual(mockEstadisticas);
                expect(axiosClient.get).toHaveBeenCalledWith('/admin/estadisticas', jasmine.objectContaining({
                    params: { anio: 2024, facultad: 'Facultad A', carrera: 'Carrera B' }
                }));
                done();
            });
        });
    });

    describe('eliminarInscripcion', () => {
        it('should call delete with correct params', (done) => {
            (axiosClient.delete as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

            service.eliminarInscripcion('1', 'CURSADA').subscribe(() => {
                expect(axiosClient.delete).toHaveBeenCalledWith('/admin/inscripciones/1', jasmine.objectContaining({
                    params: { tipo: 'CURSADA' }
                }));
                done();
            });
        });
    });

    describe('matricular', () => {
        it('should call post with request data', (done) => {
            const request = { idUsuario: '1', idFacultad: 'f1', idCarrera: 'c1', nroPlan: 2024 };
            (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

            service.matricular(request as any).subscribe(() => {
                expect(axiosClient.post).toHaveBeenCalledWith('/admin/matriculacion', request);
                done();
            });
        });
    });
});
