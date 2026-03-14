import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegularCertComponent } from './regular-cert.component';
import { StudentService } from '@core/services/student.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
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
});
