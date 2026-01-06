import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '../api/axios.client';
import { MateriaRequest, MateriaResponse, TipoMateria } from '../models/materia.models';

@Injectable({
    providedIn: 'root'
})
export class MateriaService {

    constructor() { }

    crearMateria(materia: MateriaRequest): Observable<MateriaResponse> {
        return from(axiosClient.post<MateriaResponse>('/materias', materia)).pipe(
            map(response => response.data)
        );
    }

    actualizarMateria(id: string, materia: MateriaRequest): Observable<MateriaResponse> {
        return from(axiosClient.put<MateriaResponse>(`/materias/${id}`, materia)).pipe(
            map(response => response.data)
        );
    }

    listarTodas(tipo?: TipoMateria): Observable<MateriaResponse[]> {
        const params: any = {};
        if (tipo) params.tipo = tipo;

        return from(axiosClient.get<MateriaResponse[]>('/materias', { params })).pipe(
            map(response => response.data)
        );
    }

    buscarPorId(id: string): Observable<MateriaResponse> {
        return from(axiosClient.get<MateriaResponse>(`/materias/${id}`)).pipe(
            map(response => response.data)
        );
    }

    eliminarMateria(id: string): Observable<void> {
        return from(axiosClient.delete<void>(`/materias/${id}`)).pipe(
            map(response => response.data)
        );
    }
}
