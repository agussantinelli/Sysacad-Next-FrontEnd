export interface PlanDeEstudioRequest {
    idFacultad: string; // UUID
    idCarrera: string;
    nombrePlan: string;
    fechaInicio: string; // LocalDate
    fechaFin?: string; // LocalDate
    esVigente: boolean;
}

export interface PlanDeEstudioResponse {
    nombrePlan: string;
    fechaInicio: string; // LocalDate
    fechaFin?: string; // LocalDate
    esVigente: boolean;
    nombreCarrera: string;
}
