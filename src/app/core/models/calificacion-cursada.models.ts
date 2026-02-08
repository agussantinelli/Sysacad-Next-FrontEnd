export interface CalificacionCursadaResponse {
    id: string; 
    descripcion: string;
    nota: number; 
    fecha: string; 
}

export interface CalificacionCursadaRequest {
    descripcion: string;
    nota: number; 
}
