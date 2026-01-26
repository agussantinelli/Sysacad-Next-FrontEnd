import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { GrupoRequest, GrupoResponse, MiembroGrupoRequest, MensajeGrupoRequest, MensajeGrupoResponse, MiembroGrupoResponse } from '@core/models/grupo.models';

@Injectable({
    providedIn: 'root'
})
export class GrupoService {

    constructor() { }

    crearGrupo(grupo: GrupoRequest): Observable<GrupoResponse> {
        return from(axiosClient.post<GrupoResponse>('/grupos', grupo)).pipe(
            map(response => response.data)
        );
    }

    getMisGrupos(): Observable<GrupoResponse[]> {
        return from(axiosClient.get<GrupoResponse[]>('/grupos/mis-grupos')).pipe(
            map(response => response.data)
        );
    }

    getGrupo(id: string): Observable<GrupoResponse> {
        return from(axiosClient.get<GrupoResponse>(`/grupos/${id}`)).pipe(
            map(response => response.data)
        );
    }

    agregarMiembro(idGrupo: string, miembro: MiembroGrupoRequest): Observable<void> {
        return from(axiosClient.post<void>(`/grupos/${idGrupo}/miembros`, miembro)).pipe(
            map(() => void 0)
        );
    }

    eliminarMiembro(idGrupo: string, idUsuario: string): Observable<void> {
        return from(axiosClient.delete<void>(`/grupos/${idGrupo}/miembros/${idUsuario}`)).pipe(
            map(() => void 0)
        );
    }

    enviarMensaje(idGrupo: string, mensaje: MensajeGrupoRequest): Observable<MensajeGrupoResponse> {
        return from(axiosClient.post<MensajeGrupoResponse>(`/grupos/${idGrupo}/mensajes`, mensaje)).pipe(
            map(response => response.data)
        );
    }

    getMensajes(idGrupo: string): Observable<MensajeGrupoResponse[]> {
        // Assuming default pagination or list return for now as per catalog simplicity
        return from(axiosClient.get<MensajeGrupoResponse[]>(`/grupos/${idGrupo}/mensajes`)).pipe(
            map(response => response.data)
        );
    }

    marcarLeido(idGrupo: string): Observable<void> {
        return from(axiosClient.post<void>(`/grupos/${idGrupo}/marcar-leido`)).pipe(
            map(() => void 0)
        );
    }

    getMiembros(idGrupo: string): Observable<MiembroGrupoResponse[]> {
        return from(axiosClient.get<MiembroGrupoResponse[]>(`/grupos/${idGrupo}/miembros`)).pipe(
            map(response => response.data)
        );
    }
}
