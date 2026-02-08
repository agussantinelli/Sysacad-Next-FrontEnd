import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';


export const guestGuard: CanActivateFn = (route, state): UrlTree | boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};
