import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReporteCertificadoDTO } from '../models/reporte.models';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private apiUrl = `${environment.apiUrl}/reportes`;

    constructor(private http: HttpClient) { }

    getCertificadosHistory(): Observable<ReporteCertificadoDTO[]> {
        return this.http.get<ReporteCertificadoDTO[]>(`${this.apiUrl}/certificados`);
    }
}
