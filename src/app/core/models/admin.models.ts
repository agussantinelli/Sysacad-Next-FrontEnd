import { ProfesorEstadisticasDTO } from './professor.models';

export interface AdminInscripcionDTO {
    id: string; 
    tipo: 'CURSADA' | 'EXAMEN';
    idAlumno: string;
    nombre: string;
    apellido: string;
    fotoPerfil?: string;
    legajoAlumno: string;
    nombreMateria: string;
    comision: string; 
    fechaInscripcion: string; 
    estado: string;
}

export interface AdminEstadisticasDTO extends ProfesorEstadisticasDTO {
    
    
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
    idReferencia: string; 
    idMateria?: string; 
    nroDetalle?: number; 
}


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


export interface CarreraAdminDTO {
    id: string;
    nombre: string;
    alias: string;
    cantidadMatriculados: number;
    planes: any[]; 
}

export interface MateriaDetalleDTO {
    id: string;
    nombre: string;
    codigo: string;
    nivel: number;
    horasCursado: number; 
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


export interface MesaExamenRequest {
    nombre: string;
    fechaInicio: string; 
    fechaFin: string; 
}

export interface DetalleMesaRequest {
    idMesaExamen: string;
    idMateria: string;
    idPresidente: string;
    diaExamen: string; 
    horaExamen: string; 
}

export interface DetalleMesaExamenResponse {
    idMesaExamen: string;
    nroDetalle: number;
    nombreMateria: string;
    idMateria: string;
    nombrePresidente?: string;
    idPresidente?: string;
    diaExamen: string; 
    horaExamen: string; 
    cantidadInscriptos?: number; 
    abierta?: boolean; 
}

export interface MesaExamenResponse {
    id: string; 
    nombre: string;
    fechaInicio: string; 
    fechaFin: string; 
    cantidadInscriptos: number; 
    detalles: DetalleMesaExamenResponse[];
}




export type MesaAdminDTO = DetalleMesaExamenResponse; 




export interface AdminComisionDTO {
    id: string;
    nombre: string;
    turno: string;
    anio: number;
    nivel: number;
    idCarrera: string;
    nombreCarrera: string;
    nombreSalon: string;
    materias?: AdminMateriaComisionDTO[];
}

export interface AdminMateriaComisionDTO {
    idMateria: string;
    nombreMateria: string;
    nivel: number; 
    cantidadInscriptos: number; 
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
    idsProfesores: string[]; 
    horarios: HorarioRequestDTO[];
}

export interface HorarioRequestDTO {
    dia: string; 
    horaDesde: string; 
    horaHasta: string; 
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
    nivel: number;
    idCarrera: string; 
    idSalon: string; 
    idsMaterias: string[]; 
    idsProfesores: string[]; 
}

export interface SimpleMateriaDTO {
    id: string; 
    nombre: string;
    anio: number; 
}
