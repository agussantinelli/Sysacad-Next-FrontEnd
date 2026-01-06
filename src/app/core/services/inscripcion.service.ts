import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '../api/axios.client';
import { InscripcionRequest, InscripcionResponse } from '../models/inscripcion.models';
import { CalificacionRequest } from '../models/calificacion.models';

@Injectable({
    providedIn: 'root'
})
export class InscripcionService {

    constructor() { }

    inscribirAlumno(inscripcion: InscripcionRequest): Observable<InscripcionResponse> {
        return from(axiosClient.post<InscripcionResponse>('/inscripciones', inscripcion)).pipe(
            map(response => response.data)
        );
    }

    historialAlumno(idAlumno: string): Observable<InscripcionResponse[]> {
        return from(axiosClient.get<InscripcionResponse[]>(`/inscripciones/alumno/${idAlumno}`)).pipe(
            map(response => response.data)
        );
    }

    cargarNota(calificacion: CalificacionRequest): Observable<void> {
        return from(axiosClient.post<void>('/inscripciones/notas', calificacion)).pipe(
            map(response => response.data)
        );
    }

    validarCorrelatividad(idAlumno: string, idMateria: string): Observable<boolean> {
        return from(axiosClient.get<boolean>('/inscripciones/validar-correlatividad', {
            params: { idAlumno, idMateria }
        })).pipe(
            map(response => response.data)
        );
    }
}
