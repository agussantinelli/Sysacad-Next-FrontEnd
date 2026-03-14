import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorCertComponent } from './professor-cert.component';
import { ProfessorService } from '@core/services/professor.service';
import { AlertService } from '@core/services/alert.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfessorCertComponent', () => {
    let component: ProfessorCertComponent;
    let fixture: ComponentFixture<ProfessorCertComponent>;
    let professorService: jasmine.SpyObj<ProfessorService>;

    beforeEach(async () => {
        const professorSpy = jasmine.createSpyObj('ProfessorService', ['getServicesCertificate']);
        const alertSpy = jasmine.createSpyObj('AlertService', ['error']);

        await TestBed.configureTestingModule({
            imports: [ProfessorCertComponent, NoopAnimationsModule],
            providers: [
                { provide: ProfessorService, useValue: professorSpy },
                { provide: AlertService, useValue: alertSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessorCertComponent);
        component = fixture.componentInstance;
        professorService = TestBed.inject(ProfessorService) as jasmine.SpyObj<ProfessorService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
