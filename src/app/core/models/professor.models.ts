import { RolCargo } from '@core/enums/professor.enums';

export interface MateriaProfesorDTO {
    id: string; // UUID
    nombre: string;
    nivel: number;
    plan: string;
    cargo: RolCargo;
}
