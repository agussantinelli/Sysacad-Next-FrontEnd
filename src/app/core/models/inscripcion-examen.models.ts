export interface InscripcionExamenRequest {
    idUsuario?: string; // UUID, Optional
    idMesaExamen: string; // UUID
    nroDetalle: number;
}

export interface InscripcionExamenResponse {
    id: string; // UUID
    nombreAlumno: string;
    legajoAlumno: string;
    nombreMateria: string;
    fechaExamen: string; // LocalDate
    horaExamen: string; // LocalTime
    fechaInscripcion: string; // LocalDateTime
    estado: string; // e.g., "PENDIENTE"
    nota: number; // BigDecimal
}
