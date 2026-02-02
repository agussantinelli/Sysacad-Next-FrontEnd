import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { MateriaProfesorDTO, ComisionHorarioDTO } from '@core/models/professor.models';

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
}
