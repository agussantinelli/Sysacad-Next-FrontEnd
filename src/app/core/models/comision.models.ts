export enum DiaSemana {
    LUNES = 'LUNES',
    MARTES = 'MARTES',
    MIERCOLES = 'MIERCOLES',
    JUEVES = 'JUEVES',
    VIERNES = 'VIERNES',
    SABADO = 'SABADO'
}

export interface ProfesorResumenDTO {
    legajo: string;
    nombreCompleto: string;
}

export interface ComisionRequest {
    nombre: string;
    turno: string;
    anio: number;
    idSalon: string; // UUID
    idsMaterias: string[]; // List of UUIDs
    idsProfesores: string[]; // List of UUIDs
}

export interface ComisionResponse {
    id: string; // UUID
    nombre: string;
    turno: string;
    anio: number;
    nombreSalon: string;
    ubicacionSalon: string;
    materiasNombres: string[];
    profesores: ProfesorResumenDTO[];
}
