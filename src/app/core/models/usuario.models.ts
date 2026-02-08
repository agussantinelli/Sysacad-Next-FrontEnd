import { TipoDocumento, Genero, RolUsuario } from '../enums/usuario.enums';

export enum EstadoUsuario {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO'
}

export interface InfoCarrera {
    nombreCarrera: string;
    facultad: string;
    anioPlan: number;
}

export interface UsuarioRequest {
    legajo?: string;
    password?: string;
    tipoDocumento: TipoDocumento;
    dni: string;
    nombre: string;
    apellido: string;
    mail: string;
    fechaNacimiento: string; 
    genero: Genero;
    telefono: string;
    direccion: string;
    ciudad: string;
    fotoPerfil?: string;
    fechaIngreso: string; 
    tituloAcademico?: string;
    rol: RolUsuario;
    estado?: EstadoUsuario;
}

export interface UsuarioResponse {
    id: string; 
    legajo: string;
    tipoDocumento: TipoDocumento;
    dni: string;
    nombre: string;
    apellido: string;
    mail: string;
    fechaNacimiento: string; 
    genero: Genero;
    telefono: string;
    direccion: string;
    ciudad: string;
    fotoPerfil?: string;
    fechaIngreso: string; 
    tituloAcademico?: string;
    rol: RolUsuario;
    estado: EstadoUsuario;
    tipoIdentificador?: string;
    anioIngreso?: number;
    passwordChangeRequired?: boolean;
    carreras?: InfoCarrera[];
}

export interface CambioPasswordRequest {
    passwordActual: string;
    passwordNueva: string;
}
