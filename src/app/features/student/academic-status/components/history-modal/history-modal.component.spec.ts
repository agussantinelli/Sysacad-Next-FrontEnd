import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryModalComponent } from './history-modal.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HistoryModalComponent', () => {
    let component: HistoryModalComponent;
    let fixture: ComponentFixture<HistoryModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HistoryModalComponent, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(HistoryModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
