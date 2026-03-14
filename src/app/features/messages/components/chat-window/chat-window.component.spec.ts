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

    it('should group messages by date', () => {
        component.messages = [
            { id: '1', contenido: 'Msg 1', fechaEnvio: new Date().toISOString() },
            { id: '2', contenido: 'Msg 2', fechaEnvio: new Date().toISOString() },
            { id: '3', contenido: 'Msg 3', fechaEnvio: '2024-03-10T10:00:00Z' }
        ] as any;
        
        const groups = component.groupedMessages;
        expect(groups.length).toBe(2);
        expect(groups[0].dateLabel).toBe('Hoy');
    });

    it('should emit sendMessage', () => {
        spyOn(component.sendMessage, 'emit');
        component.canSend = true;
        component.newMessage = 'Hello';
        component.handleSendMessage();
        
        expect(component.sendMessage.emit).toHaveBeenCalledWith('Hello');
        expect(component.newMessage).toBe('');
    });

    it('should toggle participants', () => {
        expect(component.showParticipants).toBeFalse();
        component.toggleParticipants();
        expect(component.showParticipants).toBeTrue();
    });

    it('should identify mine own messages', () => {
        component.currentUserId = 'U1';
        const msg = { idUsuarioRemitente: 'U1' } as any;
        expect(component.isMine(msg)).toBeTrue();
    });
});
