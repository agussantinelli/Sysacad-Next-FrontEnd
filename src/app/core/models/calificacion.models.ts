import { TipoInscripcion } from '@core/models/inscripcion.models';

export interface CalificacionRequest {
    idUsuario: string; // UUID
    idComision: string; // UUID
    tipoInscripcion: TipoInscripcion;
    vecesTipoInscripcion: number;
    concepto: string;
    nota: number; // BigDecimal
}

export interface CalificacionResponse {
    idUsuario: string; // UUID
    nombreUsuario: string;
    legajoUsuario: string;
    idComision: string; // UUID
    nombreComision: string;
    materia: string;
    tipoInscripcion: TipoInscripcion;
    vecesTipoInscripcion: number;
    concepto: string;
    nota: number; // BigDecimal
    fecha: string; // LocalDate
}
