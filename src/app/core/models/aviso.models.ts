export interface AvisoRequest {
    titulo: string;
    descripcion: string;
    estado: string;
}

export interface AvisoResponse {
    id: string; 
    titulo: string;
    descripcion: string;
    fechaEmision: string; 
    estado: string;
    visto: boolean;
}
