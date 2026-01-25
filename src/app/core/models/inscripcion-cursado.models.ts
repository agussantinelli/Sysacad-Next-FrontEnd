import { CalificacionCursadaResponse } from './calificacion-cursada.models';

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
