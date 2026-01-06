export interface CarreraRequest {
    idFacultad: string; // UUID
    idCarrera: string; // Code
    nombre: string;
}

export interface CarreraResponse {
    idFacultad: string; // UUID
    idCarrera: string; // Code
    nombre: string;
    nombreFacultad: string;
}
