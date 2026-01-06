export enum TipoMateria {
    BASICA = 'BASICA',
    ESPECIFICA = 'ESPECIFICA',
    COMPARTIDA = 'COMPARTIDA'
}

export enum DuracionMateria {
    ANUAL = 'ANUAL',
    CUATRIMESTRAL = 'CUATRIMESTRAL'
}

export enum ModalidadMateria {
    PRESENCIAL = 'PRESENCIAL',
    MIXTO = 'MIXTO',
    VIRTUAL = 'VIRTUAL'
}

export enum CuatrimestreDictado {
    PRIMERO = 'PRIMERO',
    SEGUNDO = 'SEGUNDO',
    ANUAL = 'ANUAL',
    AMBOS = 'AMBOS'
}

export interface SimpleMateriaDTO {
    id: string; // UUID
    nombre: string;
}

export interface MateriaRequest {
    nombre: string;
    descripcion?: string;
    tipoMateria: TipoMateria;
    duracion: DuracionMateria;
    modalidad?: ModalidadMateria;
    cuatrimestreDictado: CuatrimestreDictado;
    horasCursado: number; // Short
    rendirLibre: boolean;
    optativa: boolean;
    idsCorrelativas?: string[]; // List of UUIDs
}

export interface MateriaResponse {
    id: string; // UUID
    nombre: string;
    descripcion: string;
    tipoMateria: TipoMateria;
    duracion: DuracionMateria;
    modalidad: ModalidadMateria;
    cuatrimestreDictado: CuatrimestreDictado;
    horasCursado: number;
    rendirLibre: boolean;
    optativa: boolean;
    correlativas?: SimpleMateriaDTO[];
}
