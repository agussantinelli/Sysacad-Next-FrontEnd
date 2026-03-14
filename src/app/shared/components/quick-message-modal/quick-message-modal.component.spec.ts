import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickMessageModalComponent } from './quick-message-modal.component';
import { ChatService } from '@core/services/chat.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('QuickMessageModalComponent', () => {
    let component: QuickMessageModalComponent;
    let fixture: ComponentFixture<QuickMessageModalComponent>;

    beforeEach(async () => {
        const chatSpy = jasmine.createSpyObj('ChatService', ['enviarMensajeComisionMateria']);

        await TestBed.configureTestingModule({
            imports: [QuickMessageModalComponent, NoopAnimationsModule, FormsModule],
            providers: [
                { provide: ChatService, useValue: chatSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(QuickMessageModalComponent);
        component = fixture.componentInstance;
        component.idComision = '1';
        component.idMateria = '1';
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
