import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UsuarioResponse } from '../models/auth.models';
import axiosClient from '../api/axios.client';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private router = inject(Router);

    constructor() { }

    login(credentials: LoginRequest): Observable<UsuarioResponse> {
        return from(axiosClient.post<LoginResponse>('/auth/login', credentials)).pipe(
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
