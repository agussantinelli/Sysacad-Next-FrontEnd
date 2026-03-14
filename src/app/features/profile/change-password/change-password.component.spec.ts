import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { UsuarioService } from '@core/services/usuario.service';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let usuarioService: jasmine.SpyObj<UsuarioService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['cambiarPassword']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1' } as any)
        });
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'clear']);

        await TestBed.configureTestingModule({
            imports: [ChangePasswordComponent, NoopAnimationsModule, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: UsuarioService, useValue: usuarioSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: AlertService, useValue: alertSpy },
                FormBuilder
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
