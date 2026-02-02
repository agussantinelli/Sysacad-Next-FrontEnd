import { Injectable, inject } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse } from '@core/models/auth.models';
import { UsuarioResponse } from '@core/models/usuario.models';
import axiosClient from '@core/api/axios.client';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private router = inject(Router);
    private currentUserSubject = new BehaviorSubject<UsuarioResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.currentUserSubject.next(JSON.parse(userStr));
            } catch (e) {
                console.error('Error parsing user from local storage', e);
                this.logout();
            }
        }
    }

    login(credentials: LoginRequest): Observable<UsuarioResponse> {
        return from(axiosClient.post<AuthResponse>('/auth/login', credentials)).pipe(
            map(response => response.data),
            tap(({ token, usuario, bootId }) => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(usuario));
                if (bootId) {
                    localStorage.setItem('bootId', bootId);
                }
                this.currentUserSubject.next(usuario);
            }),
            map(({ usuario }) => usuario)
        );
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('bootId');
        sessionStorage.removeItem('welcomeShown');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    updateUser(usuario: UsuarioResponse) {
        localStorage.setItem('user', JSON.stringify(usuario));
        this.currentUserSubject.next(usuario);
    }

    isAuthenticated(): boolean {
        return (!!this.currentUserSubject.value || !!localStorage.getItem('token')) && !!localStorage.getItem('bootId');
    }
}
