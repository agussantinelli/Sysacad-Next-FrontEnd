import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { CarreraMateriasDTO } from '@core/models/carrera-materias.models';
import { HistorialMateriaDTO } from '@core/models/historial.models';

@Injectable({
    providedIn: 'root'
})
export class MatriculacionService {

    constructor() { }

    getMisCarrerasMaterias(): Observable<CarreraMateriasDTO[]> {
        return from(axiosClient.get<CarreraMateriasDTO[]>('/alumnos/mis-carreras-materias')).pipe(
            map(response => response.data)
        );
    }

    getHistorialMateria(idMateria: string): Observable<HistorialMateriaDTO> {
        return from(axiosClient.get<HistorialMateriaDTO>(`/alumnos/mis-carreras-materias/historial/${idMateria}`)).pipe(
            map(response => response.data)
        );
    }
}
