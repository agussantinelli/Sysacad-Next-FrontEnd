import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatWindowComponent } from './chat-window.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChatWindowComponent', () => {
    let component: ChatWindowComponent;
    let fixture: ComponentFixture<ChatWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatWindowComponent, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ChatWindowComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
