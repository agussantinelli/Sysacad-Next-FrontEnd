export interface DetalleCursadaDTO {
    fechaInscripcion: string;
    comision: string;
    estado: string;
    nota: string;
    tomo: string;
    folio: string;
    anioCursado?: number;
}

export interface DetalleFinalDTO {
    fechaExamen: string; 
    turno: string;
    estado: string; 
    nota: string;
    tomo: string;
    folio: string;
}

export interface HistorialMateriaDTO {
    nombreMateria: string;
    cursadas: DetalleCursadaDTO[];
    finales: DetalleFinalDTO[];
}
