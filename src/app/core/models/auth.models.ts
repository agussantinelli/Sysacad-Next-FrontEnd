import { UsuarioResponse } from './usuario.models';

export interface LoginRequest {
    identificador: string;
    password?: string;
    tipoIdentificador?: string;
}

export interface AuthResponse {
    token: string;
    usuario: UsuarioResponse;
}
