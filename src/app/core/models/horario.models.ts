import { DiaSemana } from '../enums/horario.enums';

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
