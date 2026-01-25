import { EstadoExamen } from '../enums/inscripcion.enums';

export interface CargaNotaExamenRequest {
    nota: number; // BigDecimal
    estado: EstadoExamen;
}

export interface CalificacionCursadaResponse {
    id: string; // UUID
    descripcion: string;
    nota: number; // BigDecimal
    fecha: string; // LocalDate
}

export interface CalificacionCursadaRequest {
    descripcion: string;
    nota: number; // BigDecimal
}
