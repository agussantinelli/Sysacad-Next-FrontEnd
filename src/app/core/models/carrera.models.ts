export interface CarreraRequest {
    idFacultad: string; // UUID
    alias: string;
    nombre: string;
}

export interface CarreraResponse {
    id: string; // UUID
    alias: string;
    nombre: string;
    facultades: string[];
}
