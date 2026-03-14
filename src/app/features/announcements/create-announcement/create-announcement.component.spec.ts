import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAnnouncementComponent } from './create-announcement.component';
import { AvisoService } from '@core/services/aviso.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateAnnouncementComponent', () => {
    let component: CreateAnnouncementComponent;
    let fixture: ComponentFixture<CreateAnnouncementComponent>;
    let avisoService: jasmine.SpyObj<AvisoService>;
    let alertService: jasmine.SpyObj<AlertService>;

    beforeEach(async () => {
        const avisoSpy = jasmine.createSpyObj('AvisoService', ['crearAviso']);
        const alertSpy = jasmine.createSpyObj('AlertService', ['error', 'success']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [CreateAnnouncementComponent, NoopAnimationsModule],
            providers: [
                { provide: AvisoService, useValue: avisoSpy },
                { provide: AlertService, useValue: alertSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateAnnouncementComponent);
        component = fixture.componentInstance;
        avisoService = TestBed.inject(AvisoService) as jasmine.SpyObj<AvisoService>;
        alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should create announcement successfully', () => {
        const router = TestBed.inject(Router);
        avisoService.crearAviso.and.returnValue(of({} as any));
        
        component.aviso = { titulo: 'T', descripcion: 'D', estado: 'ACTIVO' };
        component.onSubmit();
        
        expect(avisoService.crearAviso).toHaveBeenCalledWith({ titulo: 'T', descripcion: 'D', estado: 'ACTIVO' });
        expect(alertService.success).toHaveBeenCalledWith('Aviso creado exitosamente.');
        expect(router.navigate).toHaveBeenCalledWith(['/admin/announcements']);
    });

    it('should handle validation error on submit', () => {
        component.aviso = { titulo: '', descripcion: '', estado: 'ACTIVO' };
        component.onSubmit();
        
        expect(alertService.error).toHaveBeenCalledWith('Por favor completa los campos obligatorios.');
        expect(avisoService.crearAviso).not.toHaveBeenCalled();
    });

    it('should handle error from api', () => {
        const { throwError } = require('rxjs');
        avisoService.crearAviso.and.returnValue(throwError(() => new Error('Error')));
        
        component.aviso = { titulo: 'T', descripcion: 'D', estado: 'ACTIVO' };
        component.onSubmit();
        
        expect(alertService.error).toHaveBeenCalledWith('Ocurrió un error al crear el aviso.');
        expect(component.isLoading).toBeFalse();
    });

    it('should cancel and navigate back', () => {
        const router = TestBed.inject(Router);
        component.cancel();
        expect(router.navigate).toHaveBeenCalledWith(['/admin/announcements']);
    });
});
