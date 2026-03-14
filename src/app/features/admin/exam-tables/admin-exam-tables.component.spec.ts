import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminExamTablesComponent } from './admin-exam-tables.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminExamTablesComponent', () => {
    let component: AdminExamTablesComponent;
    let fixture: ComponentFixture<AdminExamTablesComponent>;
    let adminService: jasmine.SpyObj<AdminService>;
    let alertService: jasmine.SpyObj<AlertService>;

    beforeEach(async () => {
        const adminSpy = jasmine.createSpyObj('AdminService', [
            'getAllTurnos', 
            'crearTurno', 
            'editarTurno', 
            'eliminarTurno'
        ]);
        const alertSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AdminExamTablesComponent, NoopAnimationsModule],
            providers: [
                { provide: AdminService, useValue: adminSpy },
                { provide: AlertService, useValue: alertSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminExamTablesComponent);
        component = fixture.componentInstance;
        adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
        alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

        adminService.getAllTurnos.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load turns on init', () => {
        const mockTurns = [
            { id: '1', nombre: 'Turn 1', fechaInicio: '2024-03-01', fechaFin: '2024-03-10' },
            { id: '2', nombre: 'Turn 2', fechaInicio: '2024-02-01', fechaFin: '2024-02-10' }
        ] as any;
        adminService.getAllTurnos.and.returnValue(of(mockTurns));
        
        component.ngOnInit();
        
        expect(adminService.getAllTurnos).toHaveBeenCalled();
        expect(component.turns[0].nombre).toBe('Turn 2'); // Sorted by date
    });

    it('should navigate to turn detail', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');
        component.selectTurno({ id: '123' } as any);
        expect(router.navigate).toHaveBeenCalledWith(['/admin/exam-tables', '123']);
    });

    it('should determine if turn is active', () => {
        const now = new Date();
        const start = new Date(now.getTime() - 86400000); // Yesterday
        const end = new Date(now.getTime() + 86400000); // Tomorrow
        
        const turn = { fechaInicio: start.toISOString(), fechaFin: end.toISOString() } as any;
        expect(component.isTurnActive(turn)).toBeTrue();
    });

    it('should save new turn successfully', () => {
        adminService.crearTurno.and.returnValue(of({} as any));
        spyOn(component, 'loadTurnos');
        
        component.newTurno = { nombre: 'New', fechaInicio: '2024-01-01', fechaFin: '2024-01-02' };
        component.saveTurno();
        
        expect(adminService.crearTurno).toHaveBeenCalledWith(component.newTurno);
        expect(alertService.success).toHaveBeenCalled();
        expect(component.showCreateTurnModal).toBeFalse();
    });

    it('should prevent deleting turn with inscriptions', () => {
        const turn = { id: '1', cantidadInscriptos: 5 } as any;
        component.deleteTurno(turn, new Event('click'));
        expect(component.showDeleteConfirmation).toBeFalse();
        expect(alertService.error).toHaveBeenCalled();
    });

    it('should delete turn on confirmation', () => {
        adminService.eliminarTurno.and.returnValue(of({} as any));
        spyOn(component, 'loadTurnos');
        
        component.turnToDelete = { id: '123' } as any;
        component.confirmDelete();
        
        expect(adminService.eliminarTurno).toHaveBeenCalledWith('123');
        expect(alertService.success).toHaveBeenCalled();
    });
});
