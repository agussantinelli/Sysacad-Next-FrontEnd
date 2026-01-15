import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { HorarioRequest, HorarioResponse } from '@core/models/horario.models';

@Injectable({
    providedIn: 'root'
})
export class HorarioService {

    constructor() { }

    registrarHorario(horario: HorarioRequest): Observable<HorarioResponse> {
        return from(axiosClient.post<HorarioResponse>('/horarios', horario)).pipe(
            map(response => response.data)
        );
    }

    obtenerHorariosComision(idComision: string): Observable<HorarioResponse[]> {
        return from(axiosClient.get<HorarioResponse[]>(`/horarios/comision/${idComision}`)).pipe(
            map(response => response.data)
        );
    }

    eliminarHorario(idComision: string, idMateria: string, dia: string, horaDesde: string): Observable<void> {
        return from(axiosClient.delete<void>('/horarios', {
            params: {
                idComision,
                idMateria,
                dia,
                horaDesde
            }
        })).pipe(
            map(response => response.data)
        );
    }
}
