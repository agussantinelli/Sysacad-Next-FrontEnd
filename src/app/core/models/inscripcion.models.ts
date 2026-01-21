import { CalificacionCursadaResponse } from './calificacion.models';

export enum EstadoCursada {
    CURSANDO = 'CURSANDO',
    REGULAR = 'REGULAR',
    PROMOCIONADO = 'PROMOCIONADO',
    LIBRE = 'LIBRE',
    APROBADO = 'APROBADO'
}

// InscripcionExamen
export interface InscripcionExamenRequest {
    idUsuario?: string; // UUID, Optional
    idMesaExamen: string; // UUID
    nroDetalle: number;
}

export interface InscripcionExamenResponse {
    id: string; // UUID
    nombreAlumno: string;
    legajoAlumno: string;
    nombreMateria: string;
    fechaExamen: string; // LocalDate
    horaExamen: string; // LocalTime
    fechaInscripcion: string; // LocalDateTime
    estado: string; // e.g., "PENDIENTE"
    nota: number; // BigDecimal
}

// InscripcionCursado
export interface InscripcionCursadoRequest {
    idUsuario?: string; // UUID, Optional
    idMateria: string; // UUID
    idComision: string; // UUID
}

export interface InscripcionCursadoResponse {
    id: string; // UUID
    nombreMateria: string;
    nombreComision: string;
    anioCursado: number;
    estado: string; // e.g., "CURSANDO"
    notaFinal: number; // BigDecimal
    fechaPromocion: string; // LocalDate
    fechaInscripcion: string; // LocalDateTime
    calificaciones: CalificacionCursadaResponse[];
}