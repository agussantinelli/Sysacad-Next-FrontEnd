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
