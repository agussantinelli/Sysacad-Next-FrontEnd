import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLayoutComponent } from './page-layout.component';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PageLayoutComponent', () => {
    let component: PageLayoutComponent;
    let fixture: ComponentFixture<PageLayoutComponent>;

    beforeEach(async () => {
        const alertSpy = jasmine.createSpyObj('AlertService', ['clear']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [PageLayoutComponent, NoopAnimationsModule],
            providers: [
                { provide: AlertService, useValue: alertSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PageLayoutComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
