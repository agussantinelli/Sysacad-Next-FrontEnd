export interface CarreraRequest {
    idFacultad: string; // UUID
    nroCarrera: number; // Integer (Composite Key Part)
    alias: string;
    nombre: string;
}

export interface CarreraResponse {
    idFacultad: string; // UUID
    nroCarrera: number; // Integer
    alias: string;
    nombre: string;
    nombreFacultad: string;
}
