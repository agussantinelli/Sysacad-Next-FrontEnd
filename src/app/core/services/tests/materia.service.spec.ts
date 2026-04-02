import { TestBed } from '@angular/core/testing';
import { MateriaService } from '../materia.service';
import axiosClient from '@core/api/axios.client';

describe('MateriaService', () => {
    let service: MateriaService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [MateriaService] });
        spyOn(axiosClient, 'get');
        service = TestBed.inject(MateriaService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('listarTodas', () => {
        it('should call GET /materias', (done) => {
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));
            service.listarTodas().subscribe(() => {
                expect(axiosClient.get).toHaveBeenCalledWith('/materias', jasmine.any(Object));
                done();
            });
        });
    });
});

