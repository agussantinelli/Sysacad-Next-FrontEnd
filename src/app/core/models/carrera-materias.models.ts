import { EstudianteMateriaDTO } from './estudiante-materia.models';

export interface CarreraMateriasDTO {
    idCarrera: string; // UUID
    nombreCarrera: string;
    idFacultad: string; // UUID
    nombreFacultad: string;
    nombrePlan: string;
    materias: EstudianteMateriaDTO[];
}
