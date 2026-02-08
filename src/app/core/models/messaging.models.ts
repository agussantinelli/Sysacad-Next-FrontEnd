import { EstadoGrupo, RolGrupo } from "../enums/grupo.enums";

export interface GrupoRequest {
    nombre: string;
    descripcion: string;
    tipo: string;
    idsIntegrantes: string[]; 
}

export interface GrupoIntegranteDTO {
    idUsuario: string; 
    nombre: string;
    apellido: string;
    rol: RolGrupo;
    foto: string;
}

export interface GrupoResponse {
    id: string; 
    nombre: string;
    descripcion: string;
    tipo: string;
    estado: EstadoGrupo;
    fechaCreacion: string; 
    idComision: string; 
    idMateria: string; 
    esVisible: boolean;
    mensajesSinLeer: number;
    integrantes: GrupoIntegranteDTO[];
    cantIntegrantes: number;
    horaUltimoMensaje: string; 
}

export interface MiembroGrupoRequest {
    idUsuario: string; 
    rol: RolGrupo;
}

export interface MiembroGrupoResponse {
    idUsuario: string; 
    nombre: string;
    apellido: string;
    rol: RolGrupo;
    fechaUnion: string; 
    ultimoAcceso: string; 
}

export interface MensajeGrupoRequest {
    contenido: string;
    idUsuarioRemitente?: string; 
    idComision: string; 
    idMateria: string; 
}

export interface MensajeGrupoResponse {
    id: string; 
    idGrupo: string; 
    idUsuarioRemitente: string; 
    nombreRemitente: string;
    apellidoRemitente: string;
    fotoRemitente: string;
    contenido: string;
    editado: boolean;
    fechaEnvio: string; 
    leido: boolean;
}
