import { RolCargo } from '@core/enums/professor.enums';

export interface MateriaProfesorDTO {
    id: string; // UUID
    nombre: string;
    nivel: number;
    plan: string;
    cargo: RolCargo;
    jefeCatedra: string | null; // Name of head professor, null if user IS the head
}

export interface ComisionHorarioDTO {
    idComision: string; // UUID
    nombre: string;
    anio: number;
    turno: string;
    salon: string;
    horarios: string[]; // Formatted schedules (e.g., "LUNES 08:00 - 12:00")
    profesores: string[]; // All professors if requester is head, empty otherwise
    cantidadAlumnos: number; // Number of students in this commission
}

export interface ComisionDetalladaDTO extends ComisionHorarioDTO {
    nombreMateria: string;
    idMateria: string; // UUID
}
