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

export interface AdminInscripcionRequest {
    idAlumno: string;
    tipo: 'CURSADA' | 'EXAMEN';
    idReferencia: string; // ID Comision or ID MesaExamen
    idMateria?: string; // Required for CURSADA
    nroDetalle?: number; // Required for EXAMEN (Usually extracted from available exams)
}
