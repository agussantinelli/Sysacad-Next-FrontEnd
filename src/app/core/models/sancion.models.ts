export interface SancionRequest {
    idUsuario: string; 
    motivo: string;
    fechaInicio: string; 
    fechaFin: string; 
}

export interface SancionResponse {
    id: string; 
    idUsuario: string; 
    nombreUsuario: string;
    legajoUsuario: string;
    motivo: string;
    fechaInicio: string; 
    fechaFin: string; 
}
