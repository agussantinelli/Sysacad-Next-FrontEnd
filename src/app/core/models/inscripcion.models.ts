

export enum TipoInscripcion {
    CURSADO = 'CURSADO',
    EXAMEN = 'EXAMEN'
}

export interface InscripcionRequest {
    idUsuario: string; // UUID
    idComision: string; // UUID
    tipo: TipoInscripcion;
    vecesTipo?: number;
    condicion?: string;
}

export interface InscripcionResponse {
    nombreMateria: string;
    comision: string;
    anioCursado: number;
    tipo: TipoInscripcion;
    fechaInscripcion: string;
    condicion: string;
    notaFinal: number; // BigDecimal
    idMateria: string; // UUID
    idComision: string; // UUID
}

