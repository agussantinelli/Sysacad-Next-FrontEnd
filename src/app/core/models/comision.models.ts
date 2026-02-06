export interface ProfesorResumenDTO {
    legajo: string;
    nombreCompleto: string;
}

import { RolCargo } from '../enums/comision.enums';

export interface ComisionRequest {
    nombre: string;
    turno: string;
    anio: number;
    nivel: number;
    idCarrera: string; // UUID
    idSalon: string; // UUID
    idsMaterias: string[]; // List of UUIDs
    idsProfesores: string[]; // List of UUIDs
}

export interface MateriaDetalleDTO {
    nombreMateria: string;
    idMateria: string;
    profesores: ProfesorResumenDTO[];
}

export interface ComisionResponse {
    id: string; // UUID
    nombre: string;
    turno: string;
    anio: number;
    nivel: number;
    nombreCarrera: string;
    idCarrera: string; // UUID
    nombreSalon: string;
    ubicacionSalon: string;
    materiasNombres: string[];
    profesores: ProfesorResumenDTO[];
    materiasDetalle: MateriaDetalleDTO[];
}
