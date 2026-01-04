import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, UsuarioResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor() { }

    login(credentials: LoginRequest): Observable<UsuarioResponse> {
        return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, credentials);
    }
}
