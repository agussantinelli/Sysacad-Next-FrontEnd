export enum DiaSemana {
    LUNES = 'LUNES',
    MARTES = 'MARTES',
    MIERCOLES = 'MIERCOLES',
    JUEVES = 'JUEVES',
    VIERNES = 'VIERNES',
    SABADO = 'SABADO'
}

export interface HorarioRequest {
    idComision: string; // UUID
    idMateria: string; // UUID
    dia: DiaSemana;
    horaDesde: string; // LocalTime
    horaHasta: string; // LocalTime
}

export interface HorarioResponse {
    idComision: string; // UUID
    nombreComision: string;
    idMateria: string; // UUID
    nombreMateria: string;
    dia: DiaSemana;
    horaDesde: string; // LocalTime
    horaHasta: string; // LocalTime
}
