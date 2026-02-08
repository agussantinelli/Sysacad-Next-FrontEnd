export interface PlanDeEstudioRequest {
    idCarrera: string; 
    nroPlan: number;
    nombrePlan: string;
    fechaInicio: string; 
    fechaFin?: string; 
    esVigente: boolean;
}

export interface PlanDeEstudioResponse {
    nroPlan: number;
    nombrePlan: string;
    fechaInicio: string; 
    fechaFin?: string; 
    esVigente: boolean;
    nombreCarrera: string;
    idCarrera: string; 
}
