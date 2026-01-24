import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocurrió un error inesperado.';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                // The backend returns a JSON object with a 'message' field
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                } else {
                    // Fallback for status codes if no specific message is present
                    if (error.status === 401) {
                        errorMessage = 'No autorizado. Por favor inicie sesión nuevamente.';
                    } else if (error.status === 403) {
                        errorMessage = 'Acceso denegado.';
                    } else if (error.status === 404) {
                        errorMessage = 'Recurso no encontrado.';
                    } else if (error.status === 500) {
                        errorMessage = 'Error interno del servidor.';
                    } else {
                        errorMessage = `Error código ${error.status}: ${error.message}`;
                    }
                }
            }

            notificationService.showError(errorMessage);
            return throwError(() => error);
        })
    );
};
