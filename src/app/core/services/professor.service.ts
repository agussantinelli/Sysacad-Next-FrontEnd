import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { MateriaProfesorDTO, ComisionHorarioDTO, ComisionDetalladaDTO, ProfesorMesaExamenDTO, ProfesorDetalleExamenDTO, AlumnoExamenDTO, CargaNotaItemDTO, AlumnoCursadaDTO, CargaNotasCursadaDTO } from '@core/models/professor.models';

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

    getMisComisiones(): Observable<ComisionDetalladaDTO[]> {
        return from(axiosClient.get<ComisionDetalladaDTO[]>('/profesores/mis-comisiones')).pipe(
            map(response => response.data)
        );
    }

    getMesasExamen(): Observable<ProfesorMesaExamenDTO[]> {
        return from(axiosClient.get<ProfesorMesaExamenDTO[]>('/profesores/mesas-examen')).pipe(
            map(response => response.data)
        );
    }

    getDetallesMesaExamen(idMesa: string): Observable<ProfesorDetalleExamenDTO[]> {
        return from(axiosClient.get<ProfesorDetalleExamenDTO[]>(`/profesores/mesas-examen/${idMesa}/materias`)).pipe(
            map(response => response.data)
        );
    }

    getInscriptosExamen(idMesa: string, nroDetalle: number): Observable<AlumnoExamenDTO[]> {
        return from(axiosClient.get<AlumnoExamenDTO[]>(`/profesores/mesas-examen/${idMesa}/materias/${nroDetalle}/inscriptos`)).pipe(
            map(response => response.data)
        );
    }

    cargarNotasExamen(notas: CargaNotaItemDTO[]): Observable<void> {
        return from(axiosClient.post<void>('/profesores/mesas-examen/calificar-lote', notas)).pipe(
            map(response => response.data)
        );
    }

    getServicesCertificate(): Observable<Blob> {
        return from(axiosClient.get('/profesores/certificado-regular', {
            responseType: 'blob'
        })).pipe(
            map(response => response.data)
        );
    }

    getInscriptosComision(idComision: string, idMateria: string): Observable<AlumnoCursadaDTO[]> {
        return from(axiosClient.get<AlumnoCursadaDTO[]>(`/profesores/comisiones/${idComision}/materias/${idMateria}/inscriptos`)).pipe(
            map(response => response.data)
        );
    }

    cargarNotasComision(idComision: string, idMateria: string, notasDTO: CargaNotasCursadaDTO): Observable<void> {
        return from(axiosClient.post<void>(`/profesores/comisiones/${idComision}/materias/${idMateria}/calificar`, notasDTO)).pipe(
            map(response => response.data)
        );
    }
}
