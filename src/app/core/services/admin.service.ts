import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { AdminInscripcionDTO, AdminEstadisticasDTO, MatriculacionRequest } from '@core/models/admin.models';
import { FacultadResponse } from '@core/models/facultad.models';
import { CarreraResponse } from '@core/models/carrera.models';
import { PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';
import { UsuarioResponse } from '@core/models/usuario.models';

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

    crearInscripcion(data: any): Observable<any> {
        return from(axiosClient.post<any>('/admin/inscripciones', data)).pipe(
            map(response => response.data)
        );
    }

    // Matriculacion (Enroll Student to Career)
    buscarUsuarios(legajo: string): Observable<UsuarioResponse[]> {
        return from(axiosClient.get<UsuarioResponse[]>('/admin/matriculacion/usuarios/buscar', {
            params: { legajo }
        })).pipe(
            map(response => response.data)
        );
    }

    obtenerFacultades(): Observable<FacultadResponse[]> {
        return from(axiosClient.get<FacultadResponse[]>('/admin/matriculacion/facultades')).pipe(
            map(response => response.data)
        );
    }

    obtenerCarreras(facultadId: string): Observable<CarreraResponse[]> {
        return from(axiosClient.get<CarreraResponse[]>('/admin/matriculacion/carreras', {
            params: { facultadId }
        })).pipe(
            map(response => response.data)
        );
    }

    obtenerPlanes(carreraId: string): Observable<PlanDeEstudioResponse[]> {
        return from(axiosClient.get<PlanDeEstudioResponse[]>('/admin/matriculacion/planes', {
            params: { carreraId }
        })).pipe(
            map(response => response.data)
        );
    }

    matricular(request: MatriculacionRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/matriculacion', request)).pipe(
            map(response => response.data)
        );
    }
}
