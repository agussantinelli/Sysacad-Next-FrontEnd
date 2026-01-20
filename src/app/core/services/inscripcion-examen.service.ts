import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { InscripcionExamenRequest, InscripcionExamenResponse } from '@core/models/inscripcion.models';
import { EstadoExamen, CargaNotaExamenRequest } from '@core/models/calificacion.models';

@Injectable({
    providedIn: 'root'
})
export class InscripcionExamenService {

    constructor() { }

    inscribirExamen(inscripcion: InscripcionExamenRequest): Observable<InscripcionExamenResponse> {
        return from(axiosClient.post<InscripcionExamenResponse>('/inscripciones-examen', inscripcion)).pipe(
            map(response => response.data)
        );
    }

    misInscripciones(): Observable<InscripcionExamenResponse[]> {
        return from(axiosClient.get<InscripcionExamenResponse[]>('/inscripciones-examen/mis-inscripciones')).pipe(
            map(response => response.data)
        );
    }

    bajaInscripcion(id: string): Observable<void> {
        return from(axiosClient.delete<void>(`/inscripciones-examen/${id}`)).pipe(
            map(response => response.data)
        );
    }

    calificarExamen(idInscripcion: string, cargaNota: CargaNotaExamenRequest): Observable<void> {
        return from(axiosClient.post<void>(`/inscripciones-examen/${idInscripcion}/calificar`, cargaNota)).pipe(
            map(response => response.data)
        );
    }
}
