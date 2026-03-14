import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let themeService: jasmine.SpyObj<ThemeService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);
        const themeSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode']);

        await TestBed.configureTestingModule({
            imports: [ForgotPasswordComponent, NoopAnimationsModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ThemeService, useValue: themeSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
