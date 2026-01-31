import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private alertSubject = new BehaviorSubject<Alert | null>(null);
    alert$ = this.alertSubject.asObservable();

    success(message: string) {
        this.alertSubject.next({ type: 'success', message });
    }

    error(message: string) {
        this.alertSubject.next({ type: 'error', message });
    }

    info(message: string) {
        this.alertSubject.next({ type: 'info', message });
    }

    warning(message: string) {
        this.alertSubject.next({ type: 'warning', message });
    }

    clear() {
        this.alertSubject.next(null);
    }
}
