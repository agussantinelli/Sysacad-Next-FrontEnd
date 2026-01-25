import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state): UrlTree | boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // User is logged in, redirect to dashboard
        // But IF we are already on dashboard or trying to go there, allow.
        // Wait, this guard is for ROOT '/'.
        return router.createUrlTree(['/dashboard']);
    } else {
        // User is not logged in, redirect to login
        return router.createUrlTree(['/login']);
    }
};
