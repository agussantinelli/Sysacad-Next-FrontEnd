import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { MateriaProfesorDTO, ComisionHorarioDTO, ComisionDetalladaDTO, ProfesorMesaExamenDTO, ProfesorDetalleExamenDTO } from '@core/models/professor.models';

@Injectable({
    providedIn: 'root'
})
export class ProfessorService {

    constructor() { }

    getMisMaterias(): Observable<MateriaProfesorDTO[]> {
        return from(axiosClient.get<MateriaProfesorDTO[]>('/profesores/mis-materias')).pipe(
            map(response => response.data)
        );
    }

    getComisionesByMateria(idMateria: string): Observable<ComisionHorarioDTO[]> {
        return from(axiosClient.get<ComisionHorarioDTO[]>(`/profesores/materias/${idMateria}/comisiones`)).pipe(
            map(response => response.data)
        );
    }

    getMisComisiones(): Observable<ComisionDetalladaDTO[]> {
        return from(axiosClient.get<ComisionDetalladaDTO[]>('/profesores/mis-comisiones')).pipe(
            map(response => response.data)
        );
    }

    getMesasExamen(): Observable<ProfesorMesaExamenDTO[]> {
        return from(axiosClient.get<ProfesorMesaExamenDTO[]>('/profesores/mesas-examen')).pipe(
            map(response => response.data)
        );
    }

    getDetallesMesaExamen(idMesa: string): Observable<ProfesorDetalleExamenDTO[]> {
        return from(axiosClient.get<ProfesorDetalleExamenDTO[]>(`/profesores/mesas-examen/${idMesa}/materias`)).pipe(
            map(response => response.data)
        );
    }
}
