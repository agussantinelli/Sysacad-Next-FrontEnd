export interface CorrelativaDTO {
    nombre: string;
    condicion: string; // "REGULAR" | "PROMOCIONADA"
}

export interface EstudianteMateriaDTO {
    idMateria: string; // UUID
    nombre: string;
    nivel: number;
    estado: string; // "PENDIENTE", "CURSANDO", "REGULAR", "APROBADA"
    nota: string; // "8", "9.50", "-"
    sePuedeInscribir: boolean;
    esElectiva: boolean;
    horasCursado: number;
    cuatrimestre: string;
    correlativas: CorrelativaDTO[];
    tieneInscripcionExamenPendiente: boolean;
}
