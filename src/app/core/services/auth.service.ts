import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse } from '@core/models/auth.models';
import { UsuarioResponse } from '@core/models/usuario.models';
import axiosClient from '@core/api/axios.client';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private router = inject(Router);

    constructor() { }

    login(credentials: LoginRequest): Observable<UsuarioResponse> {
        return from(axiosClient.post<AuthResponse>('/auth/login', credentials)).pipe(
            map(response => {
                const { token, usuario } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(usuario));

                return usuario;
            })
        );
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }
}
