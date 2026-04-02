import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HealthService } from '../health.service';
import { AuthService } from '../auth.service';
import axiosClient from '@core/api/axios.client';
import { of, throwError } from 'rxjs';

describe('HealthService', () => {
    let service: HealthService;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

        TestBed.configureTestingModule({
            providers: [
                HealthService,
                { provide: AuthService, useValue: authServiceSpy }
            ]
        });

        spyOn(axiosClient, 'get');
        service = TestBed.inject(HealthService);
    });

    afterEach(() => {
        service.stopMonitoring();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should stay monitoring when health is OK', fakeAsync(() => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: 'ok' }));

        service.startMonitoring();
        tick(30000);
        expect(axiosClient.get).toHaveBeenCalledWith('/health');
        expect(authServiceSpy.logout).not.toHaveBeenCalled();

        tick(30000);
        expect(axiosClient.get).toHaveBeenCalledTimes(2);

        service.stopMonitoring();
    }));

    it('should logout and stop monitoring when health fails', fakeAsync(() => {
        const errorPromise = Promise.reject('error');
        errorPromise.catch(() => { });
        (axiosClient.get as jasmine.Spy).and.returnValue(errorPromise);

        service.startMonitoring();
        tick(30001);

        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(axiosClient.get).toHaveBeenCalledWith('/health');

        // Should not call again because it stopped
        tick(30001);
        expect(axiosClient.get).toHaveBeenCalledTimes(1);
    }));

    it('should not start monitoring multiple times', fakeAsync(() => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: 'ok' }));
        service.startMonitoring();
        service.startMonitoring();
        tick(30001);
        expect(axiosClient.get).toHaveBeenCalledTimes(1);
    }));

    it('should be able to restart monitoring after stopping', fakeAsync(() => {
        (axiosClient.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: 'ok' }));
        service.startMonitoring();
        service.stopMonitoring();
        
        service.startMonitoring();
        tick(30001);
        expect(axiosClient.get).toHaveBeenCalledTimes(1);
    }));

    it('should handle unauthorized error as failure', fakeAsync(() => {
        const errorResponse = { response: { status: 401 } };
        const rejectedPromise = Promise.reject(errorResponse);
        rejectedPromise.catch(() => {}); // Prevent "Uncaught in promise" error
        (axiosClient.get as jasmine.Spy).and.returnValue(rejectedPromise);

        service.startMonitoring();
        tick(30001);
        
        flush();

        expect(authServiceSpy.logout).toHaveBeenCalled();
    }));
});

