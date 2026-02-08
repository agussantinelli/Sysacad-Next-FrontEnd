import { EstudianteMateriaDTO } from './estudiante-materia.models';

export interface CarreraMateriasDTO {
    idCarrera: string; 
    nombreCarrera: string;
    idFacultad: string; 
    nombreFacultad: string;
    nombrePlan: string;
    materias: EstudianteMateriaDTO[];
}
