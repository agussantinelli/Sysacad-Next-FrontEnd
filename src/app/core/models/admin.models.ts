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

// Faculties
export interface FacultadRequest {
    ciudad: string;
    provincia: string;
}

export interface FacultadAdminDTO {
    id: string;
    ciudad: string;
    provincia: string;
    nombreCompleto: string;
    cantidadMatriculados: number;
    carreras: string[];
}

// Careers
export interface CarreraAdminDTO {
    id: string;
    nombre: string;
    alias: string;
    cantidadMatriculados: number;
    planes: any[]; // Simulating PlanDeEstudioResponse for now to avoid circular deps if needed, otherwise import
}

export interface MateriaDetalleDTO {
    id: string;
    nombre: string;
    codigo: string;
    nivel: number;
    horasCursado: number; // Short
    tipoMateria: string;
    esElectiva: boolean;
    correlativas: string[];
}

export interface PlanDetalleDTO {
    carreraId: string;
    anio: number;
    nombre: string;
    esVigente: boolean;
    materias: MateriaDetalleDTO[];
}

// Exam Tables
export interface MesaExamenRequest {
    nombre: string;
    fechaInicio: string; // LocalDate
    fechaFin: string; // LocalDate
}

export interface DetalleMesaRequest {
    idMesaExamen: string;
    idMateria: string;
    idPresidente: string;
    diaExamen: string; // LocalDate
    horaExamen: string; // LocalTime
}

export interface MesaAdminDTO {
    idMesaExamen: string;
    nroDetalle: number;
    materia: string;
    turno: string;
    fecha: string; // LocalDateTime
    cantidadInscriptos: number;
    abierta: boolean;
}

// Commissions
export interface AdminComisionDTO {
    id: string;
    nombre: string;
    turno: string;
    anio: number;
    nombreSalon: string;
    idCarrera: string; // Needed for fetching subjects
    materias: AdminMateriaComisionDTO[];
}

export interface AdminMateriaComisionDTO {
    idMateria: string;
    nombreMateria: string;
    nivel: number; // Short in backend -> number
    cantidadInscriptos: number; // long -> number
    alumnos: AlumnoResumenDTO[];
    profesores: ProfesorResumenDTO[];
}

export interface AlumnoResumenDTO {
    idUsuario: string;
    nombre: string;
    apellido: string;
    legajo: string;
}

export interface ProfesorResumenDTO {
    idUsuario: string;
    nombre: string;
    apellido: string;
    legajo: string;
}

export interface AsignarMateriaComisionRequest {
    idMateria: string;
    idsProfesores: string[]; // List<UUID>
    horarios: HorarioRequestDTO[];
}

export interface HorarioRequestDTO {
    dia: string; // DiaSemana enum as string
    horaDesde: string; // LocalTime -> string "HH:mm"
    horaHasta: string; // LocalTime -> string "HH:mm"
}

export interface ProfesorDisponibleDTO {
    id: string;
    nombre: string;
    apellido: string;
    legajo: string;
}

export interface ComisionRequest {
    nombre: string;
    turno: string;
    anio: number;
    salon: string; // inferred from "nombreSalon" or similar
    idCarrera: string; // Usually required to link commission to a structure
}

export interface SimpleMateriaDTO {
    id: string; // UUID
    nombre: string;
    anio: number; // or nivel?
}
