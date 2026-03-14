import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegularCertComponent } from './regular-cert.component';
import { StudentService } from '@core/services/student.service';
import { AlertService } from '@core/services/alert.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegularCertComponent', () => {
    let component: RegularCertComponent;
    let fixture: ComponentFixture<RegularCertComponent>;
    let studentService: jasmine.SpyObj<StudentService>;

    beforeEach(async () => {
        const studentSpy = jasmine.createSpyObj('StudentService', ['getRegularCertificate']);
        const alertSpy = jasmine.createSpyObj('AlertService', ['error']);

        await TestBed.configureTestingModule({
            imports: [RegularCertComponent, NoopAnimationsModule],
            providers: [
                { provide: StudentService, useValue: studentSpy },
                { provide: AlertService, useValue: alertSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegularCertComponent);
        component = fixture.componentInstance;
        studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should download certificate successfully', () => {
        const mockBlob = new Blob([''], { type: 'application/pdf' });
        studentService.getRegularCertificate.and.returnValue(of(mockBlob));
        
        // Spy on window.URL and link.click
        spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
        spyOn(window.URL, 'revokeObjectURL');
        
        const mockLink = document.createElement('a');
        spyOn(document, 'createElement').and.returnValue(mockLink);
        spyOn(mockLink, 'click');

        component.downloadCertificate();
        
        expect(studentService.getRegularCertificate).toHaveBeenCalled();
        expect(mockLink.href).toContain('mock-url');
        expect(mockLink.download).toBe('Certificado_Alumno_Regular.pdf');
        expect(mockLink.click).toHaveBeenCalled();
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when downloading certificate', () => {
        const alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
        studentService.getRegularCertificate.and.returnValue(throwError(() => new Error('Error')));
        
        component.downloadCertificate();
        
        expect(alertService.error).toHaveBeenCalledWith('Error al descargar el certificado');
        expect(component.isLoading).toBeFalse();
    });
});
