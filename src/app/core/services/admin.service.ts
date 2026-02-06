import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';
import { AdminInscripcionDTO, AdminEstadisticasDTO, MatriculacionRequest, AdminInscripcionRequest, FacultadAdminDTO, FacultadRequest, CarreraAdminDTO, PlanDetalleDTO, MesaAdminDTO, MesaExamenRequest, DetalleMesaRequest, AdminComisionDTO, ComisionRequest, AsignarMateriaComisionRequest, ProfesorDisponibleDTO, SimpleMateriaDTO, MesaExamenResponse } from '@core/models/admin.models';
import { FacultadResponse } from '@core/models/facultad.models';
import { CarreraResponse } from '@core/models/carrera.models';
import { PlanDeEstudioResponse } from '@core/models/plan-de-estudio.models';
import { UsuarioResponse } from '@core/models/usuario.models';
import { ComisionDisponibleDTO } from '@core/models/comision-disponible.models';
import { MesaExamenDisponibleDTO } from '@core/models/mesa-examen-disponible.models';
import { MateriaResponse } from '@core/models/materia.models';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor() { }

    obtenerInscripciones(): Observable<AdminInscripcionDTO[]> {
        return from(axiosClient.get<AdminInscripcionDTO[]>('/admin/inscripciones')).pipe(
            map(response => response.data)
        );
    }

    obtenerEstadisticas(anio?: number, facultad?: string, carrera?: string): Observable<AdminEstadisticasDTO> {
        const params: any = {};
        if (anio) params.anio = anio;
        if (facultad) params.facultad = facultad;
        if (carrera) params.carrera = carrera;

        return from(axiosClient.get<AdminEstadisticasDTO>('/admin/estadisticas', { params })).pipe(
            map(response => response.data)
        );
    }

    eliminarInscripcion(id: string, tipo: 'CURSADA' | 'EXAMEN'): Observable<void> {
        return from(axiosClient.delete<void>(`/admin/inscripciones/${id}`, {
            params: { tipo }
        })).pipe(
            map(response => response.data)
        );
    }

    crearInscripcion(data: any): Observable<any> {
        return from(axiosClient.post<any>('/admin/inscripciones', data)).pipe(
            map(response => response.data)
        );
    }

    // Matriculacion (Enroll Student to Career)
    buscarUsuarios(legajo: string): Observable<UsuarioResponse[]> {
        return from(axiosClient.get<UsuarioResponse[]>('/admin/matriculacion/usuarios/buscar', {
            params: { legajo }
        })).pipe(
            map(response => response.data)
        );
    }

    obtenerFacultades(): Observable<FacultadResponse[]> {
        return from(axiosClient.get<FacultadResponse[]>('/admin/matriculacion/facultades')).pipe(
            map(response => response.data)
        );
    }

    obtenerCarreras(facultadId: string): Observable<CarreraResponse[]> {
        return from(axiosClient.get<CarreraResponse[]>('/admin/matriculacion/carreras', {
            params: { facultadId }
        })).pipe(
            map(response => response.data)
        );
    }

    obtenerPlanes(carreraId: string): Observable<PlanDeEstudioResponse[]> {
        return from(axiosClient.get<PlanDeEstudioResponse[]>('/admin/matriculacion/planes', {
            params: { carreraId }
        })).pipe(
            map(response => response.data)
        );
    }

    matricular(request: MatriculacionRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/matriculacion', request)).pipe(
            map(response => response.data)
        );
    }

    // Inscripciones (Cursada/Examen)
    inscribir(request: AdminInscripcionRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/inscripcion', request)).pipe(
            map(response => response.data)
        );
    }

    getMateriasCursada(idAlumno: string): Observable<MateriaResponse[]> {
        return from(axiosClient.get<MateriaResponse[]>('/admin/inscripcion/cursado/materias', {
            params: { idAlumno }
        })).pipe(
            map(response => response.data)
        );
    }

    getComisiones(idAlumno: string, idMateria: string): Observable<ComisionDisponibleDTO[]> {
        return from(axiosClient.get<ComisionDisponibleDTO[]>('/admin/inscripcion/cursado/comisiones', {
            params: { idAlumno, idMateria }
        })).pipe(
            map(response => response.data)
        );
    }

    getMateriasExamen(idAlumno: string): Observable<MateriaResponse[]> {
        return from(axiosClient.get<MateriaResponse[]>('/admin/inscripcion/examen/materias', {
            params: { idAlumno }
        })).pipe(
            map(response => response.data)
        );
    }

    getMesas(idAlumno: string, idMateria: string): Observable<MesaExamenDisponibleDTO[]> {
        return from(axiosClient.get<MesaExamenDisponibleDTO[]>('/admin/inscripcion/examen/mesas', {
            params: { idAlumno, idMateria }
        })).pipe(
            map(response => response.data)
        );
    }

    getAllFacultades(): Observable<FacultadAdminDTO[]> {
        return from(axiosClient.get<FacultadAdminDTO[]>('/admin/facultades')).pipe(
            map(response => response.data)
        );
    }

    createFacultad(request: FacultadRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/facultades', request)).pipe(
            map(response => response.data)
        );
    }

    deleteFacultad(id: string): Observable<void> {
        return from(axiosClient.delete<void>(`/admin/facultades/${id}`)).pipe(
            map(response => response.data)
        );
    }

    // --- Module: Careers ---
    getAllCarreras(): Observable<CarreraAdminDTO[]> {
        return from(axiosClient.get<CarreraAdminDTO[]>('/admin/carreras')).pipe(
            map(response => response.data)
        );
    }

    getPlanDetalle(carreraId: string, anio: number): Observable<PlanDetalleDTO> {
        return from(axiosClient.get<PlanDetalleDTO>(`/admin/carreras/${carreraId}/plan/${anio}`)).pipe(
            map(response => response.data)
        );
    }

    getCarrerasSimples(): Observable<CarreraResponse[]> {
        return from(axiosClient.get<CarreraResponse[]>('/admin/carreras/simples')).pipe(
            map(response => response.data)
        );
    }

    asociarCarreraFacultad(carreraId: string, facultadId: string): Observable<void> {
        return from(axiosClient.post<void>(`/admin/carreras/${carreraId}/facultades/${facultadId}`)).pipe(
            map(response => response.data)
        );
    }

    crearCarrera(request: { nombre: string; alias: string; horasElectivasRequeridas: number }): Observable<CarreraResponse> {
        return from(axiosClient.post<CarreraResponse>('/admin/carreras', request)).pipe(
            map(response => response.data)
        );
    }

    getPlanesDetallados(carreraId: string): Observable<PlanDetalleDTO[]> {
        return from(axiosClient.get<PlanDetalleDTO[]>(`/admin/carreras/${carreraId}/planes/detallados`)).pipe(
            map(response => response.data)
        );
    }

    // --- Module: Exam Tables ---
    getAllTurnos(): Observable<MesaExamenResponse[]> {
        return from(axiosClient.get<MesaExamenResponse[]>('/admin/mesas/turnos')).pipe(
            map(response => response.data)
        );
    }

    crearTurno(request: MesaExamenRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/mesas/turnos', request)).pipe(
            map(response => response.data)
        );
    }

    agregarDetalleMesa(request: DetalleMesaRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/mesas/detalles', request)).pipe(
            map(response => response.data)
        );
    }

    eliminarDetalleMesa(idMesa: string, nroDetalle: number): Observable<void> {
        return from(axiosClient.delete<void>(`/admin/mesas/${idMesa}/detalle/${nroDetalle}`)).pipe(
            map(response => response.data)
        );
    }

    eliminarTurno(id: string): Observable<void> {
        return from(axiosClient.delete<void>(`/admin/mesas/turnos/${id}`)).pipe(
            map(response => response.data)
        );
    }

    editarTurno(id: string, request: MesaExamenRequest): Observable<void> {
        return from(axiosClient.put<void>(`/admin/mesas/turnos/${id}`, request)).pipe(
            map(response => response.data)
        );
    }

    // --- Module: Commissions ---
    getAllComisiones(): Observable<AdminComisionDTO[]> {
        return from(axiosClient.get<AdminComisionDTO[]>('/admin/comisiones')).pipe(
            map(response => response.data)
        );
    }

    crearComision(request: ComisionRequest): Observable<void> {
        return from(axiosClient.post<void>('/admin/comisiones', request)).pipe(
            map(response => response.data)
        );
    }

    asignarMateriaComision(idComision: string, request: AsignarMateriaComisionRequest): Observable<void> {
        return from(axiosClient.post<void>(`/admin/comisiones/${idComision}/materias`, request)).pipe(
            map(response => response.data)
        );
    }

    getProfesoresDisponibles(request: AsignarMateriaComisionRequest): Observable<ProfesorDisponibleDTO[]> {
        return from(axiosClient.post<ProfesorDisponibleDTO[]>('/admin/comisiones/profesores-disponibles', request)).pipe(
            map(response => response.data)
        );
    }

    // --- Module: General/Search ---
    getCarrerasGeneral(): Observable<CarreraResponse[]> {
        return from(axiosClient.get<CarreraResponse[]>('/admin/general/carreras')).pipe(
            map(response => response.data)
        );
    }

    buscarMaterias(idCarrera: string, query: string): Observable<SimpleMateriaDTO[]> {
        return from(axiosClient.get<SimpleMateriaDTO[]>('/admin/general/materias/buscar', {
            params: { idCarrera, query }
        })).pipe(
            map(response => response.data)
        );
    }

    // --- Module: Exam Tables (Additional) ---
    getProfesoresParaMesa(idMateria: string, fecha: string, hora: string): Observable<ProfesorDisponibleDTO[]> {
        return from(axiosClient.get<ProfesorDisponibleDTO[]>('/admin/mesas/profesores-disponibles', {
            params: { idMateria, fecha, hora }
        })).pipe(
            map(response => response.data)
        );
    }
}
