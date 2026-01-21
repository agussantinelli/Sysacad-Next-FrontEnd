import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { CarreraRequest, CarreraResponse } from '@core/models/carrera.models';
import { PlanDeEstudioRequest, PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';

@Injectable({
    providedIn: 'root'
})
export class CarreraService {

    constructor() { }

    registrarCarrera(carrera: CarreraRequest): Observable<CarreraResponse> {
        return from(axiosClient.post<CarreraResponse>('/carreras', carrera)).pipe(
            map(response => response.data)
        );
    }

    listarPorFacultad(idFacultad: string): Observable<CarreraResponse[]> {
        return from(axiosClient.get<CarreraResponse[]>(`/carreras/facultad/${idFacultad}`)).pipe(
            map(response => response.data)
        );
    }

    crearPlan(plan: PlanDeEstudioRequest): Observable<PlanDeEstudioResponse> {
        return from(axiosClient.post<PlanDeEstudioResponse>('/carreras/planes', plan)).pipe(
            map(response => response.data)
        );
    }

    agregarMateriaAPlan(planMateria: { idPlan: string; idMateria: string; cuatrimestre: number }): Observable<void> {
        return from(axiosClient.post<void>('/carreras/planes/materias', planMateria)).pipe(
            map(response => response.data)
        );
    }

    listarPlanesVigentes(nroCarrera: number, idFacultad?: string): Observable<PlanDeEstudioResponse[]> {
        const params: any = {};
        if (idFacultad) params.idFacultad = idFacultad;

        return from(axiosClient.get<PlanDeEstudioResponse[]>(`/carreras/${nroCarrera}/planes/vigentes`, { params })).pipe(
            map(response => response.data)
        );
    }
}
