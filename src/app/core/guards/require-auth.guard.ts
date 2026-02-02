import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const requireAuthGuard: CanActivateFn = (route, state): UrlTree | boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    } else {
        return router.createUrlTree(['/login']);
    }
};
