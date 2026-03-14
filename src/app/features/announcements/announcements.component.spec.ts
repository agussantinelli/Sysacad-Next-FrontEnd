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

    it('should load announcements on init', () => {
        const mockAvisos = [
            { id: '1', titulo: 'A1', fechaEmision: '2024-03-01', visto: false },
            { id: '2', titulo: 'A2', fechaEmision: '2024-03-02', visto: true }
        ] as any;
        avisoService.listarAvisos.and.returnValue(of(mockAvisos));
        
        component.ngOnInit();
        
        expect(avisoService.listarAvisos).toHaveBeenCalled();
        expect(component.avisos.length).toBe(2);
        expect(component.avisos[0].id).toBe('2'); // Sorted by date desc
    });

    it('should filter announcements by status', () => {
        component.avisos = [
            { id: '1', visto: true, fechaEmision: '2024-01-01' },
            { id: '2', visto: false, fechaEmision: '2024-01-01' }
        ] as any;
        
        component.statusFilter = 'unread';
        expect(component.filteredAvisos.length).toBe(1);
        expect(component.filteredAvisos[0].id).toBe('2');
        
        component.statusFilter = 'read';
        expect(component.filteredAvisos.length).toBe(1);
        expect(component.filteredAvisos[0].id).toBe('1');
    });

    it('should mark announcement as read', () => {
        const mockAviso = { id: '1', visto: false } as any;
        avisoService.marcarLeido.and.returnValue(of(undefined));
        
        component.markAsRead(mockAviso);
        
        expect(avisoService.marcarLeido).toHaveBeenCalledWith('1');
        expect(mockAviso.visto).toBeTrue();
    });

    it('should toggle announcement state for admin', () => {
        const mockAviso = { id: '1', estado: 'ACTIVO' } as any;
        avisoService.cambiarEstado.and.returnValue(of({ id: '1', estado: 'OCULTO' } as any));
        
        component.toggleState(mockAviso);
        
        expect(avisoService.cambiarEstado).toHaveBeenCalledWith('1', 'OCULTO');
        expect(mockAviso.estado).toBe('OCULTO');
        expect(alertService.success).toHaveBeenCalled();
    });

    it('should navigate to create if admin', () => {
        const router = TestBed.inject(Router);
        component.usuario = { rol: 'ADMIN' } as any;
        expect(component.canCreate).toBeTrue();
        
        component.goToCreate();
        expect(router.navigate).toHaveBeenCalledWith(['/admin/announcements/create']);
    });
});
