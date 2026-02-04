import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { ReporteCertificadoDTO } from '../models/reporte.models';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {

    constructor() { }

    getCertificadosHistory(): Observable<ReporteCertificadoDTO[]> {
        return from(axiosClient.get<ReporteCertificadoDTO[]>('/reportes/certificados')).pipe(
            map(response => response.data)
        );
    }
}
