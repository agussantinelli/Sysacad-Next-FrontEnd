import { TestBed } from '@angular/core/testing';
import { InscripcionCursadoService } from '../inscripcion-cursado.service';
import axiosClient from '@core/api/axios.client';

describe('InscripcionCursadoService', () => {
    let service: InscripcionCursadoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InscripcionCursadoService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');

        service = TestBed.inject(InscripcionCursadoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getComisionesDisponibles', () => {
        it('should call GET /inscripciones-cursado/materias/:id/disponibles', (done) => {
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));

            service.getComisionesDisponibles('m1').subscribe(() => {
                expect(axiosClient.get).toHaveBeenCalledWith('/inscripciones-cursado/materias/m1/disponibles', jasmine.any(Object));
                done();
            });
        });
    });

    describe('inscribirCursado', () => {
        it('should call POST /inscripciones-cursado', (done) => {
            const request = { idMateria: 'm1', idComision: 'c1' };
            (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: {} }));

            service.inscribirCursado(request as any).subscribe(() => {
                expect(axiosClient.post).toHaveBeenCalledWith('/inscripciones-cursado', request);
                done();
            });
        });
    });
});

