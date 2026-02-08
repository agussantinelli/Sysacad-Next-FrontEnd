export interface InscripcionExamenRequest {
    idUsuario: string;
    idDetalleMesa: string;
    nroDetalle: number;
}

export interface InscripcionExamenResponse {
    id: string; 
    nombreAlumno: string;
    legajoAlumno: string;
    nombreMateria: string;
    fechaExamen: string; 
    horaExamen: string; 
    fechaInscripcion: string; 
    estado: string; 
    nota: number; 
}

export interface CargaNotaExamenRequest {
    nota: number;
    estado: string; 
}
