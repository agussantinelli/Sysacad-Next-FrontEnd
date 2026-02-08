import { CalificacionCursadaResponse } from './calificacion-cursada.models';

export interface InscripcionCursadoRequest {
    idUsuario?: string; 
    idMateria: string; 
    idComision: string; 
}

export interface InscripcionCursadoResponse {
    id: string; 
    nombreMateria: string;
    nombreComision: string;
    anioCursado: number;
    estado: string; 
    notaFinal: number; 
    fechaPromocion: string; 
    fechaInscripcion: string; 
    calificaciones: CalificacionCursadaResponse[];
}
