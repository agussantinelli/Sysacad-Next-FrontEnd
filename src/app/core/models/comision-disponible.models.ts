export interface ComisionDisponibleDTO {
    idComision: string;      // UUID
    nombreComision: string;  // e.g., "1K1"
    turno: string;           // "MAÑANA", "NOCHE"
    ubicacion: string;       // "Aula 305 (Rosario)"
    horarios: string[];      // ["LUNES 18:00 - 22:00"]
    profesores: string[];    // ["Juan Perez", "Maria Garcia"]
    habilitada: boolean;     // true si se puede inscribir
    mensaje: string;         // "Disponible", "Superposición con Análisis II", "Cupo lleno"
}
