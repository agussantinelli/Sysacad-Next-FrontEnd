import { DetalleMesaExamenResponse } from './detalle-mesa-examen.models';

export interface MesaExamenRequest {
    nombre: string; // e.g., "Turno Febrero 2026"
    fechaInicio: string; // LocalDate
    fechaFin: string; // LocalDate
}

export interface MesaExamenResponse {
    id: string; // UUID
    nombre: string;
    fechaInicio: string; // LocalDate
    fechaFin: string; // LocalDate
    detalles: DetalleMesaExamenResponse[];
}


