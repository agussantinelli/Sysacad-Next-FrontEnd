import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { FacultadRequest, FacultadResponse } from '@core/models/facultad.models';

@Injectable({
    providedIn: 'root'
})
export class FacultadService {

    constructor() { }

    crearFacultad(facultad: FacultadRequest): Observable<FacultadResponse> {
        return from(axiosClient.post<FacultadResponse>('/facultades', facultad)).pipe(
            map(response => response.data)
        );
    }

    listarTodas(): Observable<FacultadResponse[]> {
        return from(axiosClient.get<FacultadResponse[]>('/facultades')).pipe(
            map(response => response.data)
        );
    }

    buscarPorId(id: string): Observable<FacultadResponse> {
        return from(axiosClient.get<FacultadResponse>(`/facultades/${id}`)).pipe(
            map(response => response.data)
        );
    }
}
