import { TestBed } from '@angular/core/testing';
import { MesaExamenService } from '../mesa-examen.service';
import axiosClient from '@core/api/axios.client';

describe('MesaExamenService', () => {
    let service: MesaExamenService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [MesaExamenService] });
        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        service = TestBed.inject(MesaExamenService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('listarMesasDisponibles', () => {
        it('should call GET /mesas/disponibles', (done) => {
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));
            service.listarMesasDisponibles().subscribe(() => {
                expect(axiosClient.get).toHaveBeenCalledWith('/mesas/disponibles');
                done();
            });
        });
    });
});

