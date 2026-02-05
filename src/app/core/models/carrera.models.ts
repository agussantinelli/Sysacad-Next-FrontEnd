export interface CarreraRequest {
    idFacultad: string; // UUID
    alias: string;
    nombre: string;
    horasElectivasRequeridas: number;
}

export interface CarreraResponse {
    id: string; // UUID
    alias: string;
    nombre: string;
    facultades: string[];
}
