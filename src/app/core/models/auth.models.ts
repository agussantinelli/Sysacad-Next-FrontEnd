export interface LoginRequest {
    identificador: string;
    password: string;
    tipoIdentificador?: string;
}

export interface InfoCarrera {
    nombreCarrera: string;
    facultad: string;
}

export interface UsuarioResponse {
    id: string;
    legajo: string;
    tipoDocumento: string;
    dni: string;
    nombre: string;
    apellido: string;
    mail: string;
    fechaNacimiento: string;
    genero: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    fotoPerfil: string;
    fechaIngreso: string;
    tituloAcademico?: string;
    rol: 'ADMIN' | 'ESTUDIANTE' | 'PROFESOR';
    estado: string;
    tipoIdentificador?: string;
    anioIngreso?: number;
    carreras?: InfoCarrera[];
}

export interface LoginResponse {
    token: string;
    usuario: UsuarioResponse;
}
