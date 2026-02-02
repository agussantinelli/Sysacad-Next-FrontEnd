import { RolCargo } from '@core/enums/professor.enums';

export interface MateriaProfesorDTO {
    id: string; // UUID
    nombre: string;
    nivel: number;
    plan: string;
    cargo: RolCargo;
}

export interface ComisionHorarioDTO {
    idComision: string; // UUID
    nombre: string;
    anio: number;
    turno: string;
    salon: string;
    horarios: string[]; // Formatted schedules (e.g., "LUNES 08:00 - 12:00")
}
