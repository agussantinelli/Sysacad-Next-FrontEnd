import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { UsuarioRequest, UsuarioResponse, RolUsuario } from '@core/models/usuario.models';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor() { }

    crearUsuario(usuario: UsuarioRequest): Observable<UsuarioResponse> {
        return from(axiosClient.post<UsuarioResponse>('/usuarios', usuario)).pipe(
            map(response => response.data)
        );
    }

    actualizarUsuario(id: string, usuario: UsuarioRequest): Observable<UsuarioResponse> {
        return from(axiosClient.put<UsuarioResponse>(`/usuarios/${id}`, usuario)).pipe(
            map(response => response.data)
        );
    }

    subirFotoPerfil(id: string, file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);

        return from(axiosClient.post<string>(`/usuarios/${id}/foto`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).pipe(
            map(response => response.data)
        );
    }

    obtenerTodos(rol?: RolUsuario): Observable<UsuarioResponse[]> {
        const params: any = {};
        if (rol) params.rol = rol;

        return from(axiosClient.get<UsuarioResponse[]>('/usuarios', { params })).pipe(
            map(response => response.data)
        );
    }

    obtenerPorId(id: string): Observable<UsuarioResponse> {
        return from(axiosClient.get<UsuarioResponse>(`/usuarios/${id}`)).pipe(
            map(response => response.data)
        );
    }

    obtenerPorLegajo(legajo: string): Observable<UsuarioResponse> {
        return from(axiosClient.get<UsuarioResponse>(`/usuarios/buscar/legajo/${legajo}`)).pipe(
            map(response => response.data)
        );
    }

    obtenerPorMateria(idMateria: string): Observable<UsuarioResponse[]> {
        return from(axiosClient.get<UsuarioResponse[]>(`/usuarios/materia/${idMateria}`)).pipe(
            map(response => response.data)
        );
    }

    obtenerAlumnosInscriptosPorMateria(idMateria: string): Observable<UsuarioResponse[]> {
        return from(axiosClient.get<UsuarioResponse[]>(`/usuarios/alumnos/materia/${idMateria}`)).pipe(
            map(response => response.data)
        );
    }

    eliminarUsuario(id: string): Observable<void> {
        return from(axiosClient.delete<void>(`/usuarios/${id}`)).pipe(
            map(response => response.data)
        );
    }
}
