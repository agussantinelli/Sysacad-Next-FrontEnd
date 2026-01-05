import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, UsuarioResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    private router = inject(Router);

    constructor() { }

    login(credentials: LoginRequest): Observable<UsuarioResponse> {
        return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, credentials);
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }
}
