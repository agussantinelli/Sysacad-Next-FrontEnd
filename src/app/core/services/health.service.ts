import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { interval, Subscription, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import axiosClient from '@core/api/axios.client';

@Injectable({
    providedIn: 'root'
})
export class HealthService {
    private authService = inject(AuthService);
    private pollingSubscription: Subscription | null = null;
    private readonly POLL_INTERVAL = 30000;

    startMonitoring() {
        if (this.pollingSubscription) {
            return;
        }

        console.log('Health monitoring started...');
        this.pollingSubscription = interval(this.POLL_INTERVAL).pipe(
            switchMap(() => {
                return from(axiosClient.get('/health')).pipe(
                    catchError(error => {
                        console.error('Backend unreachable during health check!', error);
                        this.authService.logout();
                        this.stopMonitoring();
                        return of(null);
                    })
                );
            })
        ).subscribe();
    }

    stopMonitoring() {
        if (this.pollingSubscription) {
            console.log('Health monitoring stopped.');
            this.pollingSubscription.unsubscribe();
            this.pollingSubscription = null;
        }
    }
}
