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
    tituloAcademico: string;
    rol: string;
    estado: string;
    tipoIdentificador?: string;
}
