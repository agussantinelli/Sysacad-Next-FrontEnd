import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import {
    GrupoResponse,
    GrupoRequest,
    MensajeGrupoResponse,
    MensajeGrupoRequest,
    MiembroGrupoResponse,
    MiembroGrupoRequest
} from '@core/models/messaging.models';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor() { }

    crearGrupo(request: GrupoRequest): Observable<GrupoResponse> {
        return from(axiosClient.post<GrupoResponse>('/grupos', request)).pipe(
            map(response => response.data)
        );
    }

    getMisGrupos(): Observable<GrupoResponse[]> {
        return from(axiosClient.get<GrupoResponse[]>('/grupos/mis-grupos')).pipe(
            map(response => response.data)
        );
    }

    getGruposAlumno(): Observable<GrupoResponse[]> {
        return from(axiosClient.get<GrupoResponse[]>('/grupos/alumno')).pipe(
            map(response => response.data)
        );
    }

    getGruposProfesor(): Observable<GrupoResponse[]> {
        return from(axiosClient.get<GrupoResponse[]>('/grupos/profesor')).pipe(
            map(response => response.data)
        );
    }

    getGrupo(id: string): Observable<GrupoResponse> {
        return from(axiosClient.get<GrupoResponse>(`/grupos/${id}`)).pipe(
            map(response => response.data)
        );
    }

    agregarMiembro(groupId: string, request: MiembroGrupoRequest): Observable<void> {
        return from(axiosClient.post<void>(`/grupos/${groupId}/miembros`, request)).pipe(
            map(response => response.data)
        );
    }

    eliminarMiembro(groupId: string, usuarioId: string): Observable<void> {
        return from(axiosClient.delete<void>(`/grupos/${groupId}/miembros/${usuarioId}`)).pipe(
            map(response => response.data)
        );
    }

    enviarMensajeAlGrupo(groupId: string, content: string): Observable<MensajeGrupoResponse> {
        return from(axiosClient.post<MensajeGrupoResponse>(`/grupos/${groupId}/mensajes`, { contenido: content })).pipe(
            map(response => response.data)
        );
    }

    enviarMensajeComisionMateria(request: MensajeGrupoRequest): Observable<MensajeGrupoResponse> {
        return from(axiosClient.post<MensajeGrupoResponse>('/grupos/mensajes', request)).pipe(
            map(response => response.data)
        );
    }

    getMensajes(groupId: string, page: number = 0, size: number = 20): Observable<MensajeGrupoResponse[]> {
        return from(axiosClient.get<MensajeGrupoResponse[]>(`/grupos/${groupId}/mensajes`, {
            params: { page, size }
        })).pipe(
            map(response => response.data)
        );
    }

    marcarLeido(groupId: string): Observable<void> {
        return from(axiosClient.post<void>(`/grupos/${groupId}/marcar-leido`, {})).pipe(
            map(response => response.data)
        );
    }

    getMiembros(groupId: string): Observable<MiembroGrupoResponse[]> {
        return from(axiosClient.get<MiembroGrupoResponse[]>(`/grupos/${groupId}/miembros`)).pipe(
            map(response => response.data)
        );
    }
}
