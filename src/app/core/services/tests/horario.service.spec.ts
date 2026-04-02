import { TestBed } from '@angular/core/testing';
import { HorarioService } from '../horario.service';
import axiosClient from '@core/api/axios.client';
import { HorarioRequest, HorarioResponse } from '@core/models/horario.models';

describe('HorarioService', () => {
    let service: HorarioService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HorarioService]
        });

        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        spyOn(axiosClient, 'delete');

        service = TestBed.inject(HorarioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should registrarHorario', (done) => {
        const mockRequest: HorarioRequest = { idComision: 'c1', idMateria: 'm1', dia: 'LUNES', horaDesde: '08:00', horaHasta: '10:00' } as any;
        const mockResponse: HorarioResponse = { id: '1', ...mockRequest } as any;
        (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockResponse }));

        service.registrarHorario(mockRequest).subscribe(data => {
            expect(data).toEqual(mockResponse);
            expect(axiosClient.post).toHaveBeenCalledWith('/horarios', mockRequest);
            done();
        });
    });

    it('should obtenerHorariosComision', (done) => {
        const mockHorarios: HorarioResponse[] = [{ id: '1', dia: 'LUNES' } as any];
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockHorarios }));

        service.obtenerHorariosComision('c1').subscribe(data => {
            expect(data).toEqual(mockHorarios);
            expect(axiosClient.get).toHaveBeenCalledWith('/horarios/comision/c1');
            done();
        });
    });

    it('should eliminarHorario', (done) => {
        (axiosClient.delete as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));

        service.eliminarHorario('c1', 'm1', 'LUNES', '08:00').subscribe(() => {
            expect(axiosClient.delete).toHaveBeenCalledWith('/horarios', jasmine.objectContaining({
                params: { idComision: 'c1', idMateria: 'm1', dia: 'LUNES', horaDesde: '08:00' }
            }));
            done();
        });
    });
});

