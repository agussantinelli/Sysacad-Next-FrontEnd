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
    idCarrera: string; 
    idSalon: string; 
    idsMaterias: string[]; 
    idsProfesores: string[]; 
}

export interface MateriaDetalleDTO {
    nombreMateria: string;
    idMateria: string;
    profesores: ProfesorResumenDTO[];
}

export interface ComisionResponse {
    id: string; 
    nombre: string;
    turno: string;
    anio: number;
    nivel: number;
    nombreCarrera: string;
    idCarrera: string; 
    nombreSalon: string;
    ubicacionSalon: string;
    materiasNombres: string[];
    profesores: ProfesorResumenDTO[];
    materiasDetalle: MateriaDetalleDTO[];
}
