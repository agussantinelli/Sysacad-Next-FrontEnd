import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { AvisoRequest, AvisoResponse } from '@core/models/aviso.models';

@Injectable({
    providedIn: 'root'
})
export class AvisoService {

    constructor() { }

    crearAviso(aviso: AvisoRequest): Observable<AvisoResponse> {
        return from(axiosClient.post<AvisoResponse>('/avisos', aviso)).pipe(
            map(response => response.data)
        );
    }

    listarAvisos(): Observable<AvisoResponse[]> {
        return from(axiosClient.get<AvisoResponse[]>('/avisos')).pipe(
            map(response => response.data)
        );
    }

    marcarLeido(id: string): Observable<void> {
        return from(axiosClient.post<void>(`/avisos/${id}/leido`)).pipe(
            map(response => response.data)
        );
    }

    obtenerCantidadSinLeer(): Observable<number> {
        return from(axiosClient.get<number>('/avisos/sin-leer/cantidad')).pipe(
            map(response => response.data)
        );
    }

    cambiarEstado(id: string, nuevoEstado: string): Observable<AvisoResponse> {
        return from(axiosClient.put<AvisoResponse>(`/avisos/${id}/estado`, {}, {
            params: { nuevoEstado }
        })).pipe(
            map(response => response.data)
        );
    }
}
