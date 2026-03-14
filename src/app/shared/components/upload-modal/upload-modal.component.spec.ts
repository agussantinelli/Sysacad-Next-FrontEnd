import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadModalComponent } from './upload-modal.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UploadModalComponent', () => {
    let component: UploadModalComponent;
    let fixture: ComponentFixture<UploadModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UploadModalComponent, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(UploadModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
