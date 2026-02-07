import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard that only allows unauthenticated users (guests) to access a route.
 * If the user is already authenticated, redirects them to the dashboard.
 * Uses replaceUrl: true to avoid history loops when clicking 'Back'.
 */
export const guestGuard: CanActivateFn = (route, state): UrlTree | boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // Redirect to dashboard and replace the current URL in history
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};
