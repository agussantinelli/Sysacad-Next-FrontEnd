import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '../api/axios.client';
import { CarreraRequest, CarreraResponse } from '../models/carrera.models';
import { PlanDeEstudioRequest, PlanDeEstudioResponse } from '../models/plan-de-estudio.models';

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

    // Methods from CarreraController relating to Plans
    crearPlan(plan: PlanDeEstudioRequest): Observable<PlanDeEstudioResponse> {
        return from(axiosClient.post<PlanDeEstudioResponse>('/carreras/planes', plan)).pipe(
            map(response => response.data)
        );
    }

    agregarMateriaAPlan(planMateria: { idPlan: string; idMateria: string; cuatrimestre: number }): Observable<void> {
        // Note: The backend expects PlanMateria object. Assuming structure based on usage. 
        // If PlanMateria DTO is not defined in models, we might need a type for it.
        // However, looking at the code `planService.agregarMateriaAPlan(planMateria)` it likely matches a DTO.
        // I'll assume an interface or `any` for now if not strictly defined, or create one.
        // Given usage in `PlanDeEstudioRequest`, checking if there is a helper type. Not seen.
        // I will use `any` or a local interface for the payload.
        return from(axiosClient.post<void>('/carreras/planes/materias', planMateria)).pipe(
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
