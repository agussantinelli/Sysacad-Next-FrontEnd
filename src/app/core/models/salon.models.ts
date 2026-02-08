export interface SalonRequest {
    idFacultad: string; 
    nombre: string;
    piso: string;
}

export interface SalonResponse {
    id: string; 
    idFacultad: string; 
    nombreFacultad: string;
    nombre: string;
    piso: string;
    capacidad: number;
}
