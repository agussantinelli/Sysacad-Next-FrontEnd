export enum EstadoExamen {
    PENDIENTE = 'PENDIENTE',
    APROBADO = 'APROBADO',
    DESAPROBADO = 'DESAPROBADO',
    AUSENTE = 'AUSENTE'
}

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
