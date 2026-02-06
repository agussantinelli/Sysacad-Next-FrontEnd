import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';

import { routes } from '@/app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(localeEs, 'es-AR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([errorInterceptor])),
    importProvidersFrom(MatSnackBarModule),
    { provide: LOCALE_ID, useValue: 'es-AR' }
  ]
};
