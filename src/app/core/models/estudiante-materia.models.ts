export interface CorrelativaDTO {
    nombre: string;
    condicion: string; 
}

export interface EstudianteMateriaDTO {
    idMateria: string; 
    nombre: string;
    nivel: number;
    estado: string; 
    nota: string; 
    sePuedeInscribir: boolean;
    esElectiva: boolean;
    horasCursado: number;
    cuatrimestre: string;
    correlativas: CorrelativaDTO[];
    tieneInscripcionExamenPendiente: boolean;
}
