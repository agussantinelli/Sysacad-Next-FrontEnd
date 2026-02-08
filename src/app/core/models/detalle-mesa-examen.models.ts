export interface DetalleMesaExamenRequest {
    idMesaExamen: string; 
    nroDetalle: number;
    idMateria: string; 
    idPresidente: string; 
    diaExamen: string; 
    horaExamen: string; 
}

export interface DetalleMesaExamenResponse {
    idMesaExamen: string;
    nroDetalle: number;
    nombreMateria: string;
    idMateria: string; 
    nombrePresidente: string;
    idPresidente: string; 
    diaExamen: string; 
    horaExamen: string; 
}
