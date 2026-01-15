import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { SancionRequest, SancionResponse } from '@core/models/sancion.models';

@Injectable({
    providedIn: 'root'
})
export class SancionService {

    constructor() { }

    aplicarSancion(sancion: SancionRequest): Observable<SancionResponse> {
        return from(axiosClient.post<SancionResponse>('/sanciones', sancion)).pipe(
            map(response => response.data)
        );
    }

    obtenerSancionesUsuario(idUsuario: string): Observable<SancionResponse[]> {
        return from(axiosClient.get<SancionResponse[]>(`/sanciones/usuario/${idUsuario}`)).pipe(
            map(response => response.data)
        );
    }
}
