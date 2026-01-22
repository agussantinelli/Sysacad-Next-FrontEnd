import { TipoMateria, DuracionMateria, ModalidadMateria, CuatrimestreDictado } from '../enums/materia.enums';

export interface SimpleMateriaDTO {
    id: string; // UUID
    nombre: string;
}

export interface MateriaRequest {
    nombre: string;
    descripcion: string;
    tipoMateria: TipoMateria;
    duracion: DuracionMateria;
    cuatrimestreDictado: CuatrimestreDictado;
    horasCursado: number; // Short
    rendirLibre: boolean;
    optativa: boolean;
    idsCorrelativas: string[]; // List of UUIDs
}

export interface MateriaResponse {
    id: string; // UUID
    nombre: string;
    descripcion: string;
    tipoMateria: TipoMateria;
    duracion: DuracionMateria;
    cuatrimestreDictado: CuatrimestreDictado;
    horasCursado: number; // Short
    rendirLibre: boolean;
    optativa: boolean;
    correlativas: SimpleMateriaDTO[];
}
