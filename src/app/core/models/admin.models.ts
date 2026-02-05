import { ProfesorEstadisticasDTO } from './professor.models';

export interface AdminInscripcionDTO {
    id: string; // UUID
    tipo: 'CURSADA' | 'EXAMEN';
    idAlumno: string;
    nombre: string;
    apellido: string;
    fotoPerfil?: string;
    legajoAlumno: string;
    nombreMateria: string;
    comision: string; // "N/A" for EXAMEN
    fechaInscripcion: string; // LocalDateTime
    estado: string;
}

export interface AdminEstadisticasDTO extends ProfesorEstadisticasDTO {
    // Additional aggregated fields can be added here if defined in backend
    // For now, it inherits from ProfesorEstadisticasDTO as specified
}

export interface MatriculacionRequest {
    idUsuario: string;
    idFacultad: string;
    idCarrera: string;
    nroPlan: number;
}
