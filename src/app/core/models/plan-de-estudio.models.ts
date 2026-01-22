export interface PlanDeEstudioRequest {
    idCarrera: string; // UUID
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
    idCarrera: string; // UUID
}
