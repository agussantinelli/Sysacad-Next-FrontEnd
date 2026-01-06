export interface FacultadRequest {
    ciudad: string;
    provincia: string;
}

export interface FacultadResponse {
    id: string; // UUID
    ciudad: string;
    provincia: string;
    nombreCompleto: string;
}
