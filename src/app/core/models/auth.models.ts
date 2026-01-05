export interface LoginRequest {
    identificador: string;
    password: string;
    tipoIdentificador?: string;
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
    tituloAcademico?: string; // New field
    rol: 'ADMIN' | 'ESTUDIANTE' | 'PROFESOR'; // Updated Strict Type
    estado: string;
    tipoIdentificador?: string;
}

export interface LoginResponse {
    token: string;
    usuario: UsuarioResponse;
}
