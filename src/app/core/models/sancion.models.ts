export interface SancionRequest {
    idUsuario: string; // UUID
    motivo: string;
    fechaInicio: string; // LocalDate
    fechaFin: string; // LocalDate
}

export interface SancionResponse {
    id: string; // UUID
    idUsuario: string; // UUID
    nombreUsuario: string;
    legajoUsuario: string;
    motivo: string;
    fechaInicio: string; // LocalDate
    fechaFin: string; // LocalDate
}
