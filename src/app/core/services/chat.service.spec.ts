import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import axiosClient from '@core/api/axios.client';
import { GrupoResponse, MensajeGrupoResponse } from '@core/models/messaging.models';
import { EstadoGrupo } from '@core/enums/grupo.enums';

describe('ChatService', () => {
    let service: ChatService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ChatService]
        });

        // Mock axiosClient methods
        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        spyOn(axiosClient, 'delete');

        service = TestBed.inject(ChatService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getMisGrupos', () => {
        it('should return groups from API', (done) => {
            const mockGrupos: GrupoResponse[] = [
                { id: '1', nombre: 'Test Group', tipo: 'COMISION', idReferencia: '123', estado: EstadoGrupo.ACTIVO } as any
            ];
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockGrupos }));

            service.getMisGrupos().subscribe(data => {
                expect(data).toEqual(mockGrupos);
                expect(axiosClient.get).toHaveBeenCalledWith('/grupos/mis-grupos');
                done();
            });
        });
    });

    describe('enviarMensajeAlGrupo', () => {
        it('should call post with content', (done) => {
            const mockMsg: MensajeGrupoResponse = { 
                id: '1', 
                idGrupo: 'g1',
                idUsuarioRemitente: 'u1', 
                nombreRemitente: 'John', 
                apellidoRemitente: 'Doe', 
                fotoRemitente: '',
                contenido: 'Hello', 
                editado: false,
                fechaEnvio: '2024-01-01',
                leido: false
            };
            (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockMsg }));

            service.enviarMensajeAlGrupo('g1', 'Hello').subscribe(data => {
                expect(data).toEqual(mockMsg);
                expect(axiosClient.post).toHaveBeenCalledWith('/grupos/g1/mensajes', { contenido: 'Hello' });
                done();
            });
        });
    });

    describe('marcarLeido', () => {
        it('should call marcar-leido and emit change', (done) => {
            (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: undefined }));
            let emitted = false;
            service.unreadCountChanged$.subscribe(() => emitted = true);

            service.marcarLeido('g1').subscribe(() => {
                expect(axiosClient.post).toHaveBeenCalledWith('/grupos/g1/marcar-leido', {});
                expect(emitted).toBeTrue();
                done();
            });
        });
    });
});
