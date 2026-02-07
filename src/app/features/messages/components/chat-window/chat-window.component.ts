import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoResponse, MensajeGrupoResponse } from '@core/models/messaging.models';
import { ParticipantsListComponent } from '../participants-list/participants-list.component';

@Component({
    selector: 'app-chat-window',
    standalone: true,
    imports: [CommonModule, FormsModule, ParticipantsListComponent],
    templateUrl: './chat-window.component.html',
    styleUrl: './styles/chat-window.component.css'
})
export class ChatWindowComponent implements AfterViewChecked {
    @Input() selectedConversation: GrupoResponse | null = null;
    @Input() messages: MensajeGrupoResponse[] = [];
    @Input() currentUserId: string | null = null;
    @Input() currentUserRol: string | null = null;
    @Input() canSend = false;
    @Input() isLoading = false;

    @Output() sendMessage = new EventEmitter<string>();

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    newMessage: string = '';
    showParticipants = false;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    toggleParticipants() {
        this.showParticipants = !this.showParticipants;
    }

    handleSendMessage() {
        if (!this.newMessage.trim() || !this.canSend) return;
        this.sendMessage.emit(this.newMessage);
        this.newMessage = '';
    }

    isMine(msg: MensajeGrupoResponse): boolean {
        return msg.idUsuarioRemitente === this.currentUserId;
    }

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        return `http://localhost:8080/${cleanPath}`;
    }

    get groupedMessages() {
        if (!this.messages || this.messages.length === 0) return [];

        const sorted = [...this.messages].sort((a, b) =>
            new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime()
        );

        const groups: { dateLabel: string; messages: MensajeGrupoResponse[] }[] = [];

        sorted.forEach(msg => {
            const label = this.formatMessageDate(msg.fechaEnvio);
            let group = groups.find(g => g.dateLabel === label);

            if (!group) {
                group = { dateLabel: label, messages: [] };
                groups.push(group);
            }
            group.messages.push(msg);
        });

        return groups;
    }

    private formatMessageDate(dateStr: string): string {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (d1: Date, d2: Date) =>
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();

        if (isSameDay(date, today)) return 'Hoy';
        if (isSameDay(date, yesterday)) return 'Ayer';

        return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long' });
    }

    getInitials(nombre: string, apellido: string): string {
        if (!nombre && !apellido) return '?';
        const first = nombre ? nombre.charAt(0) : '';
        const second = apellido ? apellido.charAt(0) : '';
        return (first + second).toUpperCase();
    }
}
