import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    let notificationService: jasmine.SpyObj<NotificationService>;

    beforeEach(() => {
        const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([errorInterceptor])),
                provideHttpClientTesting(),
                { provide: NotificationService, useValue: notificationSpy }
            ]
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should show unauthorized message for 401 error', () => {
        httpClient.get('/test').subscribe({
            next: () => fail('should have failed with 401 error'),
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(401);
                expect(notificationService.showError).toHaveBeenCalledWith('No autorizado. Por favor inicie sesión nuevamente.');
            }
        });

        const req = httpTestingController.expectOne('/test');
        req.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should show access denied message for 403 error', () => {
        httpClient.get('/test').subscribe({
            next: () => fail('should have failed with 403 error'),
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(403);
                expect(notificationService.showError).toHaveBeenCalledWith('Acceso denegado.');
            }
        });

        const req = httpTestingController.expectOne('/test');
        req.flush('forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should show internal server error message for 500 error', () => {
        httpClient.get('/test').subscribe({
            next: () => fail('should have failed with 500 error'),
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
                expect(notificationService.showError).toHaveBeenCalledWith('Error interno del servidor.');
            }
        });

        const req = httpTestingController.expectOne('/test');
        req.flush('internal error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should show custom error message if provided in response', () => {
        const customMessage = 'Capacidad máxima alcanzada';
        httpClient.get('/test').subscribe({
            next: () => fail('should have failed'),
            error: () => {
                expect(notificationService.showError).toHaveBeenCalledWith(customMessage);
            }
        });

        const req = httpTestingController.expectOne('/test');
        req.flush({ message: customMessage }, { status: 400, statusText: 'Bad Request' });
    });
});
