import { SimpleMateriaDTO } from './materia.models';

export interface EstudianteMateriaDTO {
    id: string; // UUID
    nombre: string;
    nivel: number;
    estado: string; // "APROBADA", "REGULAR", "CURSANDO", "PENDIENTE", "LIBRE"
    nota: string; // "8", "Promocionada", "-", etc.
    sePuedeInscribir: boolean;
}

export interface CarreraMateriasDTO {
    idCarrera: string;
    nombreCarrera: string;
    nombrePlan: string;
    materias: EstudianteMateriaDTO[];
}
