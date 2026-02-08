import { TipoMateria, DuracionMateria, ModalidadMateria, CuatrimestreDictado } from '../enums/materia.enums';

export interface SimpleMateriaDTO {
    id: string; 
    nombre: string;
}

export interface MateriaRequest {
    nombre: string;
    descripcion: string;
    tipoMateria: TipoMateria;
    duracion: DuracionMateria;
    cuatrimestreDictado: CuatrimestreDictado;
    horasCursado: number; 
    rendirLibre: boolean;
    optativa: boolean;
    idsCorrelativas: string[]; 
}

export interface MateriaResponse {
    id: string; 
    nombre: string;
    descripcion: string;
    tipoMateria: TipoMateria;
    duracion: DuracionMateria;
    cuatrimestreDictado: CuatrimestreDictado;
    horasCursado: number; 
    rendirLibre: boolean;
    optativa: boolean;
    correlativas: SimpleMateriaDTO[];
}
