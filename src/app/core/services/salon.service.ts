import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { SalonRequest, SalonResponse } from '@core/models/salon.models';

@Injectable({
    providedIn: 'root'
})
export class SalonService {

    constructor() { }

    crearSalon(salon: SalonRequest): Observable<SalonResponse> {
        return from(axiosClient.post<SalonResponse>('/salones', salon)).pipe(
            map(response => response.data)
        );
    }

    listarSalonesFacultad(idFacultad: string): Observable<SalonResponse[]> {
        return from(axiosClient.get<SalonResponse[]>(`/salones/facultad/${idFacultad}`)).pipe(
            map(response => response.data)
        );
    }
}
