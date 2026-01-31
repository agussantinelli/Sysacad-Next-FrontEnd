import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { InscripcionCursadoRequest, InscripcionCursadoResponse } from '@core/models/inscripcion-cursado.models';
import { CalificacionCursadaRequest } from '@core/models/calificacion-cursada.models';
import { ComisionDisponibleDTO } from '@core/models/comision-disponible.models';

@Injectable({
    providedIn: 'root'
})
export class InscripcionCursadoService {

    constructor() { }

    inscribirCursado(inscripcion: InscripcionCursadoRequest): Observable<InscripcionCursadoResponse> {
        return from(axiosClient.post<InscripcionCursadoResponse>('/inscripciones-cursado', inscripcion)).pipe(
            map(response => response.data)
        );
    }

    misCursadas(): Observable<InscripcionCursadoResponse[]> {
        return from(axiosClient.get<InscripcionCursadoResponse[]>('/inscripciones-cursado/mis-cursadas')).pipe(
            map(response => response.data)
        );
    }

    obtenerCursadasActuales(idUsuario?: string): Observable<InscripcionCursadoResponse[]> {
        const params = idUsuario ? { idUsuario } : {};
        return from(axiosClient.get<InscripcionCursadoResponse[]>('/inscripciones-cursado/actuales', { params })).pipe(
            map(response => response.data)
        );
    }

    getComisionesDisponibles(materiaId: string, usuarioId?: string): Observable<ComisionDisponibleDTO[]> {
        const params: any = {};
        if (usuarioId) {
            params.usuarioId = usuarioId;
        }
        return from(axiosClient.get<ComisionDisponibleDTO[]>(`/inscripciones-cursado/materias/${materiaId}/disponibles`, { params })).pipe(
            map(response => response.data)
        );
    }

    cargarNotaParcial(idInscripcion: string, calificacion: CalificacionCursadaRequest): Observable<void> {
        return from(axiosClient.post<void>(`/inscripciones-cursado/${idInscripcion}/notas`, calificacion)).pipe(
            map(response => response.data)
        );
    }
}
