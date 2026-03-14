import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);
        const activatedRouteSpy = {
            snapshot: { queryParamMap: { get: (key: string) => 'test-token' } }
        };

        await TestBed.configureTestingModule({
            imports: [ResetPasswordComponent, NoopAnimationsModule, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ThemeService, useValue: themeSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                FormBuilder
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
