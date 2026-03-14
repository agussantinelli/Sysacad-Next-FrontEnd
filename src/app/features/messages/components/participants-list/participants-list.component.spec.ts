import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantsListComponent } from './participants-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ParticipantsListComponent', () => {
    let component: ParticipantsListComponent;
    let fixture: ComponentFixture<ParticipantsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ParticipantsListComponent, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ParticipantsListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
