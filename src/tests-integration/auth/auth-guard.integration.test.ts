/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { requireAuthGuard } from '../../../src/app/core/guards/require-auth.guard';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('Auth Guard Integration', () => {
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
        mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });
    });

    it('should allow navigation if authenticated', () => {
        mockAuthService.isAuthenticated.and.returnValue(true);
        const result = TestBed.runInInjectionContext(() => requireAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
        expect(result).toBe(true);
    });

    it('should redirect if not authenticated', () => {
        mockAuthService.isAuthenticated.and.returnValue(false);
        const urlTreeMock = {} as any;
        mockRouter.createUrlTree.and.returnValue(urlTreeMock);
        
        const result = TestBed.runInInjectionContext(() => requireAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
        expect(result).toBe(urlTreeMock);
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
});
