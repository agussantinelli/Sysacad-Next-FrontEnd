import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { MesaExamenRequest, MesaExamenResponse } from '@core/models/mesa-examen.models';
import { DetalleMesaExamenRequest } from '@core/models/detalle-mesa-examen.models';

@Injectable({
    providedIn: 'root'
})
export class MesaExamenService {

    constructor() { }

    crearMesa(mesa: MesaExamenRequest): Observable<MesaExamenResponse> {
        return from(axiosClient.post<MesaExamenResponse>('/mesas', mesa)).pipe(
            map(response => response.data)
        );
    }

    listarMesas(): Observable<MesaExamenResponse[]> {
        return from(axiosClient.get<MesaExamenResponse[]>('/mesas')).pipe(
            map(response => response.data)
        );
    }

    agregarDetalleMesa(detalle: DetalleMesaExamenRequest): Observable<void> {
        return from(axiosClient.post<void>('/mesas/detalles', detalle)).pipe(
            map(response => response.data)
        );
    }
}
