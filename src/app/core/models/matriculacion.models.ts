import { SimpleMateriaDTO } from './materia.models';

export interface CarreraMateriasDTO {
    idCarrera: string;
    nombreCarrera: string;
    nombrePlan: string;
    materias: SimpleMateriaDTO[];
}
