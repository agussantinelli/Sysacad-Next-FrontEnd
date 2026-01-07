import { TipoInscripcion } from '@core/models/inscripcion.models';

export interface CalificacionRequest {
    idUsuario: string; // UUID
    idComision: string; // UUID
    tipoInscripcion: TipoInscripcion;
    vecesTipoInscripcion: number;
    concepto: string;
    nota: number; // BigDecimal
}
