import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementsComponent } from './announcements.component';
import { AvisoService } from '@core/services/aviso.service';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AnnouncementsComponent', () => {
    let component: AnnouncementsComponent;
    let fixture: ComponentFixture<AnnouncementsComponent>;
    let avisoService: jasmine.SpyObj<AvisoService>;
    let alertService: jasmine.SpyObj<AlertService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const avisoSpy = jasmine.createSpyObj('AvisoService', ['listarAvisos', 'marcarLeido', 'cambiarEstado']);
        const alertSpy = jasmine.createSpyObj('AlertService', ['error', 'success']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: '1', rol: 'ADMIN' } as any)
        });
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AnnouncementsComponent, NoopAnimationsModule],
            providers: [
                { provide: AvisoService, useValue: avisoSpy },
                { provide: AlertService, useValue: alertSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AnnouncementsComponent);
        component = fixture.componentInstance;
        avisoService = TestBed.inject(AvisoService) as jasmine.SpyObj<AvisoService>;
        alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        avisoService.listarAvisos.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
