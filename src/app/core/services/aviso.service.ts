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

    obtenerAvisos(): Observable<AvisoResponse[]> {
        return from(axiosClient.get<AvisoResponse[]>('/avisos')).pipe(
            map(response => response.data)
        );
    }
}
