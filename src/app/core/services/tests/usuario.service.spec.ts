import { TestBed } from '@angular/core/testing';
import { UsuarioService } from '../usuario.service';
import axiosClient from '@core/api/axios.client';
import { RolUsuario, EstadoUsuario, TipoDocumento, Genero } from '@core/enums/usuario.enums';
import { UsuarioResponse } from '@core/models/usuario.models';

describe('UsuarioService', () => {
    let service: UsuarioService;

    const mockUser: UsuarioResponse = {
        id: '1', legajo: '123', nombre: 'Test', apellido: 'User', mail: 'test@test.com',
        tipoDocumento: TipoDocumento.DNI, dni: '1', fechaNacimiento: '2000-01-01', genero: Genero.M,
        telefono: '1', direccion: '1', ciudad: '1', fechaIngreso: '2024-01-01',
        rol: RolUsuario.ESTUDIANTE, estado: EstadoUsuario.ACTIVO
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [UsuarioService] });
        spyOn(axiosClient, 'get');
        spyOn(axiosClient, 'post');
        spyOn(axiosClient, 'put');
        spyOn(axiosClient, 'delete');
        service = TestBed.inject(UsuarioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('obtenerPorId', () => {
        it('should call GET /usuarios/:id', (done) => {
            (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockUser }));
            service.obtenerPorId('1').subscribe(data => {
                expect(data).toEqual(mockUser);
                expect(axiosClient.get).toHaveBeenCalledWith('/usuarios/1');
                done();
            });
        });
    });

    describe('actualizarUsuario', () => {
        it('should call PUT /usuarios/:id', (done) => {
            (axiosClient.put as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockUser }));
            service.actualizarUsuario('1', mockUser as any).subscribe(() => {
                expect(axiosClient.put).toHaveBeenCalledWith('/usuarios/1', mockUser);
                done();
            });
        });
    });
});

