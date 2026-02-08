import { DetalleMesaExamenResponse } from './detalle-mesa-examen.models';

export interface MesaExamenRequest {
    nombre: string;
    fechaInicio: string; 
    fechaFin: string; 
}

export interface MesaExamenResponse {
    id: string; 
    nombre: string;
    fechaInicio: string; 
    fechaFin: string; 
    detalles: DetalleMesaExamenResponse[];
}


