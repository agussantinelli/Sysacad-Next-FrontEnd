import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor() { }

    getRegularCertificate(): Observable<Blob> {
        return from(axiosClient.get('/alumnos/certificado-regular', {
            responseType: 'blob'
        })).pipe(
            map(response => response.data)
        );
    }
}
