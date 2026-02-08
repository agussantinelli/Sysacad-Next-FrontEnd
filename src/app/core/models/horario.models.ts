import { DiaSemana } from '../enums/horario.enums';

export interface HorarioRequest {
    idComision: string; 
    idMateria: string; 
    dia: DiaSemana;
    horaDesde: string; 
    horaHasta: string; 
}

export interface HorarioResponse {
    idComision: string; 
    nombreComision: string;
    idMateria: string; 
    nombreMateria: string;
    dia: DiaSemana;
    horaDesde: string; 
    horaHasta: string; 
}
