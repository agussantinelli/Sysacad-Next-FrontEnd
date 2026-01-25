import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { InscripcionCursadoRequest, InscripcionCursadoResponse } from '@core/models/inscripcion-cursado.models';
import { CalificacionCursadaRequest } from '@core/models/calificacion-cursada.models';

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

    cargarNotaParcial(idInscripcion: string, calificacion: CalificacionCursadaRequest): Observable<void> {
        return from(axiosClient.post<void>(`/inscripciones-cursado/${idInscripcion}/notas`, calificacion)).pipe(
            map(response => response.data)
        );
    }
}
