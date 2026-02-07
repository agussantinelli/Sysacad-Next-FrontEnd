import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoResponse, MensajeGrupoResponse } from '@core/models/messaging.models';

@Component({
    selector: 'app-chat-window',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat-window.component.html',
    styleUrl: './styles/chat-window.component.css'
})
export class ChatWindowComponent {
    @Input() selectedConversation: GrupoResponse | null = null;
    @Input() messages: MensajeGrupoResponse[] = [];
    @Input() currentUserId: string | null = null;
    @Input() currentUserRol: string | null = null;
    @Input() canSend = false;
    @Input() isLoading = false;

    @Output() sendMessage = new EventEmitter<string>();

    newMessage: string = '';

    handleSendMessage() {
        if (!this.newMessage.trim() || !this.canSend) return;
        this.sendMessage.emit(this.newMessage);
        this.newMessage = '';
    }

    isMine(msg: MensajeGrupoResponse): boolean {
        return msg.idUsuarioRemitente === this.currentUserId;
    }
}
