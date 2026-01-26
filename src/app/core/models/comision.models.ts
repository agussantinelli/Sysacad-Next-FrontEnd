export interface ProfesorResumenDTO {
    legajo: string;
    nombreCompleto: string;
}

import { RolCargo } from '../enums/comision.enums';

export interface ComisionRequest {
    nombre: string;
    turno: string;
    anio: number;
    idSalon: string; // UUID
    idsMaterias: string[]; // List of UUIDs
    idsProfesores: string[]; // List of UUIDs
}

export interface ProfesorResumenDTO {
    legajo: string;
    nombreCompleto: string;
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
