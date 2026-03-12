import { TestBed } from '@angular/core/testing';
import { ProfessorService } from './professor.service';
import axiosClient from '@core/api/axios.client';
import { MateriaProfesorDTO, ComisionHorarioDTO, ComisionDetalladaDTO, CargaNotasCursadaDTO } from '@core/models/professor.models';

describe('ProfessorService', () => {
    let service: ProfessorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProfessorService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');

        service = TestBed.inject(ProfessorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should getMisMaterias', (done) => {
        const mockData: MateriaProfesorDTO[] = [{ id: '1', nombre: 'M1' } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockData }));

        service.getMisMaterias().subscribe(data => {
            expect(data).toEqual(mockData);
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/mis-materias');
            done();
        });
    });

    it('should getComisionesByMateria', (done) => {
        const mockData: ComisionHorarioDTO[] = [{ idComision: 'c1' } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockData }));

        service.getComisionesByMateria('m1').subscribe(data => {
            expect(data).toEqual(mockData);
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/materias/m1/comisiones');
            done();
        });
    });

    it('should getMisComisiones', (done) => {
        const mockData: ComisionDetalladaDTO[] = [{ idComision: 'c1' } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockData }));

        service.getMisComisiones().subscribe(data => {
            expect(data).toEqual(mockData);
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/mis-comisiones');
            done();
        });
    });

    it('should getMesasExamen', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));
        service.getMesasExamen().subscribe(data => {
            expect(data).toEqual([]);
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/mesas-examen');
            done();
        });
    });

    it('should cargarNotasExamen', (done) => {
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));
        service.cargarNotasExamen([]).subscribe(() => {
            expect(axiosClient.post).toHaveBeenCalledWith('/profesores/mesas-examen/calificar-lote', []);
            done();
        });
    });

    it('should getServicesCertificate', (done) => {
        const mockBlob = new Blob(['test']);
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockBlob }));
        service.getServicesCertificate().subscribe(data => {
            expect(data).toEqual(mockBlob);
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/certificado-regular', jasmine.objectContaining({ responseType: 'blob' }));
            done();
        });
    });

    it('should getEstadisticasGeneral', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: {} }));
        service.getEstadisticasGeneral(2024).subscribe(data => {
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/estadisticas/general', jasmine.objectContaining({ params: { anio: 2024 } }));
            done();
        });
    });

    it('should getInscriptosComision', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));
        service.getInscriptosComision('c1', 'm1').subscribe(data => {
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/comisiones/c1/materias/m1/inscriptos');
            done();
        });
    });

    it('should cargarNotasComision', (done) => {
        const mockRequest: CargaNotasCursadaDTO = { concepto: '1er Parcial', esNotaFinal: false, notas: [] };
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));
        service.cargarNotasComision('c1', 'm1', mockRequest).subscribe(() => {
            expect(axiosClient.post).toHaveBeenCalledWith('/profesores/comisiones/c1/materias/m1/calificar', mockRequest);
            done();
        });
    });

    it('should getEstadisticasMateria', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: {} }));
        service.getEstadisticasMateria('m1', 2024).subscribe(data => {
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/estadisticas/materias/m1', jasmine.objectContaining({ params: { anio: 2024 } }));
            done();
        });
    });

    it('should getAniosEstadisticas', (done) => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [2023, 2024] }));
        service.getAniosEstadisticas().subscribe(data => {
            expect(data).toEqual([2023, 2024]);
            expect(axiosClient.get).toHaveBeenCalledWith('/profesores/estadisticas/anios');
            done();
        });
    });
});
