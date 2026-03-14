import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCommissionsComponent } from './my-commissions.component';
import { ProfessorService } from '@core/services/professor.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MyCommissionsComponent', () => {
    let component: MyCommissionsComponent;
    let fixture: ComponentFixture<MyCommissionsComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getMisComisiones']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [MyCommissionsComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MyCommissionsComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;

        professorService.getMisComisiones.and.returnValue(of([]));
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load commissions on init', () => {
        const mockComms = [{ idComision: 'C1', nombreMateria: 'M1' }] as any;
        professorService.getMisComisiones.and.returnValue(of(mockComms));
        
        component.ngOnInit();
        
        expect(professorService.getMisComisiones).toHaveBeenCalled();
        expect(component.comisiones).toEqual(mockComms);
        expect(component.isLoading).toBeFalse();
    });

    it('should navigate to grading', () => {
        const router = TestBed.inject(Router);
        const mockComm = { idComision: 'C1', idMateria: 'M1' } as any;
        component.goToGrading(mockComm);
        expect(router.navigate).toHaveBeenCalledWith(['/professor/commissions', 'C1', 'subjects', 'M1', 'grading']);
    });

    it('should open and close message modal', () => {
        const mockComm = { idComision: 'C1' } as any;
        component.openMessageModal(mockComm);
        expect(component.showQuickMessageModal).toBeTrue();
        expect(component.selectedCommission).toBe(mockComm);

        component.closeMessageModal();
        expect(component.showQuickMessageModal).toBeFalse();
        expect(component.selectedCommission).toBeNull();
    });

    it('should handle error when loading commissions', () => {
        professorService.getMisComisiones.and.returnValue(throwError(() => new Error('Error')));
        
        component.loadMisComisiones();
        
        expect(component.error).toBe('No se pudieron cargar las comisiones. Intente nuevamente.');
        expect(component.isLoading).toBeFalse();
    });
});
