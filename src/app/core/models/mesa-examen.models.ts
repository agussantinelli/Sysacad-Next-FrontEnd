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

export interface DetalleMesaExamenRequest {
    idMesaExamen: string; // UUID
    nroDetalle: number;
    idMateria: string; // UUID
    idPresidente: string; // UUID
    diaExamen: string; // LocalDate
    horaExamen: string; // LocalTime
}

export interface DetalleMesaExamenResponse {
    idMesaExamen: string;
    nroDetalle: number;
    nombreMateria: string;
    idMateria: string; // UUID
    nombrePresidente: string;
    idPresidente: string; // UUID
    diaExamen: string; // LocalDate
    horaExamen: string; // LocalTime
}
