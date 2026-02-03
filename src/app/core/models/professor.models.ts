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

export interface MiembroTribunalDTO {
    nombreCompleto: string;
    rol: 'PRESIDENTE' | 'AUXILIAR';
}

export interface ProfesorMesaExamenDTO {
    id: string; // UUID (idMesaExamen)
    nombre: string; // Nombre de la mesa/turno (e.g. "Febrero 2026")
    fechaInicio: string; // LocalDate
    fechaFin: string; // LocalDate
    cantidadMateriasInvolucradas: number;
}

export interface ProfesorDetalleExamenDTO {
    idMesaExamen: string; // UUID
    nroDetalle: number;
    idMateria: string; // UUID
    nombreMateria: string;
    anioMateria: string;
    fecha: string; // LocalDate
    hora: string; // LocalTime
    cantidadInscriptos: number;
    todosCorregidos: boolean;
    tribunal: MiembroTribunalDTO[];
}

export interface AlumnoExamenDTO {
    idInscripcion: string; // UUID
    nombre: string;
    apellido: string;
    legajo: number;
    estado: 'PENDIENTE' | 'APROBADO' | 'DESAPROBADO' | 'AUSENTE';
    nota: number | null; // BigDecimal in backend, number in TS
    tomo?: string;
    folio?: string;
}

export interface CargaNotaItemDTO {
    idInscripcion: string;
    nota: number | null;
    estado: 'APROBADO' | 'DESAPROBADO' | 'AUSENTE';
    tomo?: string;
    folio?: string;
}

export interface CalificacionDTO {
    concepto: string;
    nota: number;
    fecha: string; // LocalDate
}

export interface AlumnoCursadaDTO {
    idInscripcion: string; // UUID
    nombre: string;
    apellido: string;
    legajo: number;
    estado: string; // EstadoCursada
    calificaciones: CalificacionDTO[];
}

export interface NotaCursadaItemDTO {
    idInscripcion: string;
    nota: number | null;
    estado?: string;
}

export interface CargaNotasCursadaDTO {
    concepto: string;
    esNotaFinal: boolean;
    notas: NotaCursadaItemDTO[];
}
