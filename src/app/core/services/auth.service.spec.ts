import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import axiosClient from '@core/api/axios.client';
import { of, throwError } from 'rxjs';
import { UsuarioResponse } from '@core/models/usuario.models';
import { AuthResponse } from '@core/models/auth.models';

import { TipoDocumento, Genero, RolUsuario, EstadoUsuario } from '@core/enums/usuario.enums';

describe('AuthService', () => {
    let service: AuthService;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockUser: UsuarioResponse = {
        id: '1',
        nombre: 'John',
        apellido: 'Doe',
        mail: 'john@example.com',
        legajo: '12345',
        rol: RolUsuario.ESTUDIANTE,
        tipoDocumento: TipoDocumento.DNI,
        dni: '12345678',
        fechaNacimiento: '2000-01-01',
        genero: Genero.M,
        telefono: '12345678',
        direccion: 'Calle Falsa 123',
        ciudad: 'Rosario',
        fechaIngreso: '2024-01-01',
        estado: EstadoUsuario.ACTIVO
    };

    const mockAuthResponse: AuthResponse = {
        token: 'fake-jwt-token',
        usuario: mockUser,
        bootId: 'fake-boot-id'
    };

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        
        // Mock localStorage
        const store: { [key: string]: string } = {};
        spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value);
        spyOn(localStorage, 'removeItem').and.callFake((key: string) => delete store[key]);
        spyOn(localStorage, 'clear').and.callFake(() => { for (const key in store) delete store[key]; });

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: Router, useValue: routerSpy }
            ]
        });

        // Mock axiosClient methods
        spyOn(axiosClient, 'post');

        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should login successfully and store data', (done) => {
            (axiosClient.post as jasmine.Spy).and.returnValue(Promise.resolve({ data: mockAuthResponse }));

            service.login({ identificador: '12345', password: 'password' }).subscribe({
                next: (user) => {
                    expect(user).toEqual(mockUser);
                    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
                    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
                    expect(localStorage.setItem).toHaveBeenCalledWith('bootId', 'fake-boot-id');
                    done();
                },
                error: done.fail
            });
        });

        it('should handle login error', (done) => {
            const errorResponse = { response: { data: { message: 'Invalid credentials' } } };
            (axiosClient.post as jasmine.Spy).and.returnValue(Promise.reject(errorResponse));

            service.login({ identificador: 'wrong', password: 'wrong' }).subscribe({
                next: () => done.fail('Should have failed'),
                error: (error) => {
                    expect(error).toEqual(errorResponse);
                    done();
                }
            });
        });
    });

    describe('logout', () => {
        it('should clear storage and navigate to login', () => {
            service.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('user');
            expect(localStorage.removeItem).toHaveBeenCalledWith('token');
            expect(localStorage.removeItem).toHaveBeenCalledWith('bootId');
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when token and bootId exist', () => {
            localStorage.setItem('token', 'exists');
            localStorage.setItem('bootId', 'exists');
            expect(service.isAuthenticated()).toBeTrue();
        });

        it('should return false when token is missing', () => {
            localStorage.setItem('bootId', 'exists');
            expect(service.isAuthenticated()).toBeFalse();
        });

        it('should return false when bootId is missing', () => {
            localStorage.setItem('token', 'exists');
            expect(service.isAuthenticated()).toBeFalse();
        });
    });

    describe('updateUser', () => {
        it('should update user in storage and subject', (done) => {
            const updatedUser = { ...mockUser, nombre: 'Updated' };
            
            service.updateUser(updatedUser);
            
            expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
            service.currentUser$.subscribe(user => {
                expect(user).toEqual(updatedUser);
                done();
            });
        });

        it('should handle null user in updateUser', (done) => {
            service.updateUser(null as any);
            expect(localStorage.removeItem).toHaveBeenCalledWith('user');
            service.currentUser$.subscribe(user => {
                expect(user).toBeNull();
                done();
            });
        });
    });

    describe('Storage checks', () => {
        it('should have token in local storage', () => {
            localStorage.setItem('token', 'my-token');
            expect(localStorage.getItem('token')).toBe('my-token');
        });

        it('should have bootId in local storage', () => {
            localStorage.setItem('bootId', 'my-boot-id');
            expect(localStorage.getItem('bootId')).toBe('my-boot-id');
        });
    });

    describe('currentUserSubject initialization', () => {
        it('should initialize with user from storage if present', (done) => {
            localStorage.setItem('user', JSON.stringify(mockUser));
            // We need to re-inject service to trigger constructor initialization
            const newService = TestBed.inject(AuthService);
            newService.currentUser$.subscribe(user => {
                expect(user).toEqual(mockUser);
                done();
            });
        });

        it('should initialize with null if storage is empty', (done) => {
            localStorage.clear();
            const newService = TestBed.inject(AuthService);
            newService.currentUser$.subscribe(user => {
                expect(user).toBeNull();
                done();
            });
        });

        it('should handle corrupted JSON in storage', (done) => {
            localStorage.setItem('user', 'invalid-json');
            spyOn(console, 'error');
            const newService = TestBed.inject(AuthService);
            newService.currentUser$.subscribe(user => {
                expect(user).toBeNull();
                expect(console.error).toHaveBeenCalled();
                done();
            });
        });
    });
});
