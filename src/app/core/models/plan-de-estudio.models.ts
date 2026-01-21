export interface PlanDeEstudioRequest {
    idFacultad: string; // UUID
    nroCarrera: number;
    nroPlan: number;
    nombrePlan: string;
    fechaInicio: string; // LocalDate
    fechaFin?: string; // LocalDate
    esVigente: boolean;
}

export interface PlanDeEstudioResponse {
    nroPlan: number;
    nombrePlan: string;
    fechaInicio: string; // LocalDate
    fechaFin?: string; // LocalDate
    esVigente: boolean;
    nombreCarrera: string;
}
