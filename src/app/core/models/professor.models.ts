import { RolCargo } from '@core/enums/professor.enums';

export interface MateriaProfesorDTO {
    id: string; 
    nombre: string;
    nivel: number;
    plan: string;
    cargo: RolCargo;
    jefeCatedra: string | null; 
}

export interface ComisionHorarioDTO {
    idComision: string; 
    nombre: string;
    anio: number;
    turno: string;
    salon: string;
    horarios: string[]; 
    profesores: string[]; 
    cantidadAlumnos: number; 
}

export interface ComisionDetalladaDTO extends ComisionHorarioDTO {
    nombreMateria: string;
    idMateria: string; 
}

export interface MiembroTribunalDTO {
    nombreCompleto: string;
    rol: 'PRESIDENTE' | 'AUXILIAR';
}

export interface ProfesorMesaExamenDTO {
    id: string; 
    nombre: string; 
    fechaInicio: string; 
    fechaFin: string; 
    cantidadMateriasInvolucradas: number;
}

export interface ProfesorDetalleExamenDTO {
    idMesaExamen: string; 
    nroDetalle: number;
    idMateria: string; 
    nombreMateria: string;
    anioMateria: string;
    fecha: string; 
    hora: string; 
    cantidadInscriptos: number;
    todosCorregidos: boolean;
    tribunal: MiembroTribunalDTO[];
}

export interface AlumnoExamenDTO {
    idInscripcion: string; 
    nombre: string;
    apellido: string;
    legajo: number;
    estado: 'PENDIENTE' | 'APROBADO' | 'DESAPROBADO' | 'AUSENTE';
    nota: number | null; 
    tomo?: string;
    folio?: string;
}

export interface CargaNotaItemDTO {
    idInscripcion: string;
    nota: number | null;
    estado: 'APROBADO' | 'DESAPROBADO' | 'AUSENTE';
    tomo?: string;
    folio?: string;
}

export interface CalificacionDTO {
    concepto: string;
    nota: number;
    fecha: string; 
}

export interface AlumnoCursadaDTO {
    idInscripcion: string; 
    nombre: string;
    apellido: string;
    legajo: number;
    estado: string; 
    notaFinal?: number; 
    calificaciones: CalificacionDTO[];
}

export interface NotaCursadaItemDTO {
    idInscripcion: string;
    nota: number | null;
    estado?: string;
}

export interface CargaNotasCursadaDTO {
    concepto: string;
    esNotaFinal: boolean;
    notas: NotaCursadaItemDTO[];
}

export interface ProfesorEstadisticasDTO {
    cantidadTotalAlumnos: number;
    cantidadPromocionados: number;
    cantidadRegulares: number;
    cantidadLibres: number;
    notaPromedio: number;
    cantidadTotalInscriptosExamen: number;
    cantidadAprobadosExamen: number;
    cantidadDesaprobadosExamen: number;
    cantidadAusentesExamen: number;
}
