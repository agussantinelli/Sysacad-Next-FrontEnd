import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { CarreraMateriasDTO } from '@core/models/matriculacion.models';

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
}
