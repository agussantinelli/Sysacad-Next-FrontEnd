import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, UsuarioResponse } from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    // Assuming the backend is running on localhost:8080 or configurable. 
    // Ideally this should be in environment files, but for now I'll use the URL from the controller's @CrossOrigin
    private apiUrl = 'http://localhost:8080/api/auth';

    constructor() { }

    login(credentials: LoginRequest): Observable<UsuarioResponse> {
        return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, credentials);
    }
}
