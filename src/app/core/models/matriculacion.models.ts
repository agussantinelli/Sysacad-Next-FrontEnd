import { SimpleMateriaDTO } from './materia.models';

export interface EstudianteMateriaDTO {
    idMateria: string; // UUID
    nombre: string;
    nivel: number;
    estado: string; // "PENDIENTE", "CURSANDO", "REGULAR", "APROBADA"
    nota: string; // "8", "9.50", "-"
    sePuedeInscribir: boolean;
    esElectiva: boolean;
}

export interface CarreraMateriasDTO {
    nroCarrera: number;
    nombreCarrera: string;
    nombrePlan: string;
    materias: EstudianteMateriaDTO[];
}
