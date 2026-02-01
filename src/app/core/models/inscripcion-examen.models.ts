export interface InscripcionExamenRequest {
    idUsuario?: string; // UUID, Optional
    idMesaExamen?: string; // UUID
    nroDetalle?: number;
    idDetalleMesa?: string; // UUID (Alternative for single ID)
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

export interface CargaNotaExamenRequest {
    nota: number;
    estado: string; // Enum actually
}
