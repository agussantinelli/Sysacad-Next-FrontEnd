import { TestBed } from '@angular/core/testing';
import { requireAuthGuard } from '@core/guards/require-auth.guard';
import { AuthService } from '@core/services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';

describe('Auth Guard Integration', () => {
    const mockAuthService = {
        isAuthenticated: vi.fn()
    };
    const mockRouter = {
        createUrlTree: vi.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        });
    });

    it('should allow navigation if authenticated', () => {
        mockAuthService.isAuthenticated.mockReturnValue(true);
        const result = TestBed.runInInjectionContext(() => requireAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
        expect(result).toBe(true);
    });

    it('should redirect if not authenticated', () => {
        mockAuthService.isAuthenticated.mockReturnValue(false);
        const urlTreeMock = {};
        mockRouter.createUrlTree.mockReturnValue(urlTreeMock);
        
        const result = TestBed.runInInjectionContext(() => requireAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
        expect(result).toBe(urlTreeMock);
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
});
