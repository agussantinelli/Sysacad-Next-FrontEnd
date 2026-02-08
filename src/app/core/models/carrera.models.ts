export interface CarreraRequest {
    idFacultad: string; 
    alias: string;
    nombre: string;
    horasElectivasRequeridas: number;
}

export interface CarreraResponse {
    id: string; 
    alias: string;
    nombre: string;
    facultades: string[];
}
