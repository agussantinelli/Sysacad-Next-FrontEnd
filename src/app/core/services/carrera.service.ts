import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { CarreraRequest, CarreraResponse } from '@core/models/carrera.models';
import { PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';

@Injectable({
    providedIn: 'root'
})
export class CarreraService {

    constructor() { }



    listarPorFacultad(idFacultad: string): Observable<CarreraResponse[]> {
        return from(axiosClient.get<CarreraResponse[]>(`/carreras/facultad/${idFacultad}`)).pipe(
            map(response => response.data)
        );
    }

    listarPlanesVigentes(idCarrera: string, idFacultad?: string): Observable<PlanDeEstudioResponse[]> {
        const params: any = {};
        if (idFacultad) params.idFacultad = idFacultad;

        return from(axiosClient.get<PlanDeEstudioResponse[]>(`/carreras/${idCarrera}/planes/vigentes`, { params })).pipe(
            map(response => response.data)
        );
    }
}
