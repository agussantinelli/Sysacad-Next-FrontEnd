export interface AvisoRequest {
    titulo: string;
    descripcion: string;
    estado: string;
}

export interface AvisoResponse {
    id: string; // UUID
    titulo: string;
    descripcion: string;
    fechaEmision: string; // LocalDateTime
    estado: string;
}
