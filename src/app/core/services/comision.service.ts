import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { ComisionRequest, ComisionResponse } from '@core/models/comision.models';
import { UsuarioResponse } from '@core/models/usuario.models';

@Injectable({
    providedIn: 'root'
})
export class ComisionService {

    constructor() { }

    crearComision(comision: ComisionRequest): Observable<ComisionResponse> {
        return from(axiosClient.post<ComisionResponse>('/comisiones', comision)).pipe(
            map(response => response.data)
        );
    }

    listarPorAnio(anio: number): Observable<ComisionResponse[]> {
        return from(axiosClient.get<ComisionResponse[]>('/comisiones', { params: { anio } })).pipe(
            map(response => response.data)
        );
    }

    buscarPorId(id: string): Observable<ComisionResponse> {
        return from(axiosClient.get<ComisionResponse>(`/comisiones/${id}`)).pipe(
            map(response => response.data)
        );
    }

    asignarProfesor(idComision: string, profesor: Partial<UsuarioResponse>): Observable<ComisionResponse> {
        return from(axiosClient.post<ComisionResponse>(`/comisiones/${idComision}/profesores`, profesor)).pipe(
            map(response => response.data)
        );
    }
}
