import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { requireAuthGuard } from './require-auth.guard';

describe('requireAuthGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
        const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should allow navigation if authenticated', () => {
        authService.isAuthenticated.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => requireAuthGuard({} as any, {} as any));

        expect(result).toBeTrue();
        expect(router.createUrlTree).not.toHaveBeenCalled();
    });

    it('should redirect to login if not authenticated', () => {
        authService.isAuthenticated.and.returnValue(false);
        const urlTree = {} as UrlTree;
        router.createUrlTree.and.returnValue(urlTree);

        const result = TestBed.runInInjectionContext(() => requireAuthGuard({} as any, {} as any));

        expect(result).toBe(urlTree);
        expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
});
