import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '../api/axios.client';
import { ComisionRequest, ComisionResponse } from '../models/comision.models';
// Assuming Usuario definition is needed for assigning professor, but generic object might suffice if ID is what matters, 
// but controller says `@RequestBody Usuario profesor`, so it likely expects the full object or a subset.
import { UsuarioResponse } from '../models/usuario.models';

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
        // Sending Partial<UsuarioResponse> as the backend expects Usuario.
        return from(axiosClient.post<ComisionResponse>(`/comisiones/${idComision}/profesores`, profesor)).pipe(
            map(response => response.data)
        );
    }
}
