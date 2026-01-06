import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '../api/axios.client';
import { PlanDeEstudioRequest, PlanDeEstudioResponse } from '../models/plan-de-estudio.models';

export interface PlanMateriaRequest {
    idFacultad: string;
    idCarrera: string;
    nombrePlan: string;
    idMateria: string;
    cuatrimestre: number;
    orden?: number;
}

@Injectable({
    providedIn: 'root'
})
export class PlanDeEstudioService {

    constructor() { }

    crearPlan(plan: PlanDeEstudioRequest): Observable<PlanDeEstudioResponse> {
        return from(axiosClient.post<PlanDeEstudioResponse>('/planes', plan)).pipe(
            map(response => response.data)
        );
    }

    agregarMateriaAPlan(planMateria: PlanMateriaRequest): Observable<void> {
        return from(axiosClient.post<void>('/planes/materias', planMateria)).pipe(
            map(response => response.data)
        );
    }

    listarPlanesVigentes(idCarrera: string): Observable<PlanDeEstudioResponse[]> {
        return from(axiosClient.get<PlanDeEstudioResponse[]>(`/planes/vigentes/${idCarrera}`)).pipe(
            map(response => response.data)
        );
    }

    listarTodosPorCarrera(idCarrera: string): Observable<PlanDeEstudioResponse[]> {
        return from(axiosClient.get<PlanDeEstudioResponse[]>(`/planes/carrera/${idCarrera}`)).pipe(
            map(response => response.data)
        );
    }
}
