import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';

@Injectable({
    providedIn: 'root'
})
export class CalendarioService {

    constructor() { }

    getCalendarioPdf(): Observable<Blob> {
        return from(axiosClient.get<Blob>('/calendario', { responseType: 'blob' })).pipe(
            map(response => response.data)
        );
    }
}
