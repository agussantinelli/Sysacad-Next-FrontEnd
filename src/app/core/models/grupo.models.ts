import { RolGrupo, EstadoGrupo } from '../enums/grupo.enums';

export interface GrupoRequest {
    nombre: string;
    descripcion: string;
    tipo: string;
    idsIntegrantes: string[]; // UUIDs
}

export interface GrupoResponse {
    id: string; // UUID
    nombre: string;
    descripcion: string;
    tipo: string;
    estado: EstadoGrupo;
    fechaCreacion: string; // LocalDateTime
}

export interface MiembroGrupoRequest {
    idUsuario: string; // UUID
    rol: RolGrupo;
}

export interface MiembroGrupoResponse {
    idUsuario: string; // UUID
    nombre: string;
    apellido: string;
    rol: RolGrupo;
    fechaUnion: string; // LocalDateTime
    ultimoAcceso: string; // LocalDateTime
}

export interface MensajeGrupoRequest {
    contenido: string;
    idUsuarioRemitente?: string;
}

export interface MensajeGrupoResponse {
    id: string; // UUID
    idGrupo: string; // UUID
    idUsuarioRemitente: string; // UUID
    nombreRemitente: string;
    contenido: string;
    editado: boolean;
    fechaEnvio: string; // LocalDateTime
}
