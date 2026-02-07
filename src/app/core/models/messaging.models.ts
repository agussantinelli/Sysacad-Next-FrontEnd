import { EstadoGrupo, RolGrupo } from "../enums/grupo.enums";

export interface GrupoRequest {
    nombre: string;
    descripcion: string;
    tipo: string;
    idsIntegrantes: string[]; // List of UUIDs
}

export interface GrupoIntegranteDTO {
    idUsuario: string; // UUID
    nombre: string;
    apellido: string;
    rol: RolGrupo;
    foto: string;
}

export interface GrupoResponse {
    id: string; // UUID
    nombre: string;
    descripcion: string;
    tipo: string;
    estado: EstadoGrupo;
    fechaCreacion: string; // LocalDateTime as ISO string
    idComision: string; // UUID
    idMateria: string; // UUID
    esVisible: boolean;
    mensajesSinLeer: number;
    integrantes: GrupoIntegranteDTO[];
    cantIntegrantes: number;
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
    idUsuarioRemitente?: string; // UUID: Optional/Ignored (inferred from token).
    idComision: string; // UUID: Used for automatic group creation.
    idMateria: string; // UUID: Used for automatic group creation.
}

export interface MensajeGrupoResponse {
    id: string; // UUID
    idGrupo: string; // UUID
    idUsuarioRemitente: string; // UUID
    nombreRemitente: string;
    apellidoRemitente: string;
    fotoRemitente: string;
    contenido: string;
    editado: boolean;
    fechaEnvio: string; // LocalDateTime
    leido: boolean;
}
