import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { AdminInscripcionDTO, AdminEstadisticasDTO } from '@core/models/admin.models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor() { }

    obtenerInscripciones(): Observable<AdminInscripcionDTO[]> {
        return from(axiosClient.get<AdminInscripcionDTO[]>('/admin/inscripciones')).pipe(
            map(response => response.data)
        );
    }

    obtenerEstadisticas(anio?: number, facultad?: string, carrera?: string): Observable<AdminEstadisticasDTO> {
        const params: any = {};
        if (anio) params.anio = anio;
        if (facultad) params.facultad = facultad;
        if (carrera) params.carrera = carrera;

        return from(axiosClient.get<AdminEstadisticasDTO>('/admin/estadisticas', { params })).pipe(
            map(response => response.data)
        );
    }

    eliminarInscripcion(id: string, tipo: 'CURSADA' | 'EXAMEN'): Observable<void> {
        return from(axiosClient.delete<void>(`/admin/inscripciones/${id}`, {
            params: { tipo }
        })).pipe(
            map(response => response.data)
        );
    }
}
