import { TipoDocumento, Genero, RolUsuario, EstadoUsuario } from '../enums/usuario.enums';

export interface InfoCarrera {
    nombreCarrera: string;
    facultad: string;
}

export interface UsuarioRequest {
    legajo?: string;
    password?: string;
    tipoDocumento: TipoDocumento;
    dni: string;
    nombre: string;
    apellido: string;
    mail: string;
    fechaNacimiento: string; // LocalDate 
    genero: Genero;
    telefono: string;
    direccion: string;
    ciudad: string;
    fotoPerfil?: string;
    fechaIngreso: string; // LocalDate
    tituloAcademico?: string;
    rol: RolUsuario;
    estado?: string;
}

export interface UsuarioResponse {
    id: string; // UUID
    legajo: string;
    tipoDocumento: TipoDocumento;
    dni: string;
    nombre: string;
    apellido: string;
    mail: string;
    fechaNacimiento: string; // LocalDate
    genero: Genero;
    telefono: string;
    direccion: string;
    ciudad: string;
    fotoPerfil?: string;
    fechaIngreso: string; // LocalDate
    tituloAcademico?: string;
    rol: RolUsuario;
    estado: string;
    tipoIdentificador?: string;
    anioIngreso?: number;
    passwordChangeRequired?: boolean;
    carreras?: InfoCarrera[];
}