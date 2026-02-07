import { UsuarioResponse } from '@core/models/usuario.models';

export interface LoginRequest {
    identificador: string;
    password?: string;
    tipoIdentificador?: string;
}

export interface AuthResponse {
    token: string;
    usuario: UsuarioResponse;
    bootId: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}
