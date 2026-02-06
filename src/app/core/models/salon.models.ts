export interface SalonRequest {
    idFacultad: string; // UUID
    nombre: string;
    piso: string;
}

export interface SalonResponse {
    id: string; // UUID
    idFacultad: string; // UUID
    nombreFacultad: string;
    nombre: string;
    piso: string;
    capacidad: number;
}
