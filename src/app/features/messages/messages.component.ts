import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';

import { ChatService } from '@core/services/chat.service';
import { AuthService } from '@core/services/auth.service';
import { GrupoResponse, MensajeGrupoResponse, MiembroGrupoResponse } from '@core/models/messaging.models';
import { RolGrupo } from '@core/enums/grupo.enums';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, FormsModule],
    templateUrl: './messages.component.html',
    styleUrl: './styles/messages.component.css'
})
export class MessagesComponent implements OnInit {

    conversations: GrupoResponse[] = [];
    selectedConversation: GrupoResponse | null = null;
    messages: MensajeGrupoResponse[] = [];
    newMessage: string = '';
    isLoading = false;
    currentUserId: string | null = null;
    canSend = false;

    constructor(
        private chatService: ChatService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadGroups();
    }

    loadGroups() {
        this.authService.currentUser$.subscribe(user => {
            if (!user) return;

            this.currentUserId = user.id;
            let groupsObservable;

            if (user.rol === 'ESTUDIANTE') {
                groupsObservable = this.chatService.getGruposAlumno();
            } else if (user.rol === 'PROFESOR') {
                groupsObservable = this.chatService.getGruposProfesor();
            } else {
                groupsObservable = this.chatService.getMisGrupos();
            }

            groupsObservable.subscribe({
                next: (grupos) => {
                    this.conversations = grupos;
                },
                error: (err) => console.error('Error loading groups', err)
            });
        });
    }

    selectConversation(conversation: GrupoResponse) {
        this.selectedConversation = conversation;
        this.loadMessages(conversation.id);
        this.checkPermissions(conversation.id);
        this.chatService.marcarLeido(conversation.id).subscribe();
    }

    checkPermissions(groupId: string) {
        this.chatService.getMiembros(groupId).subscribe({
            next: (miembros) => {
                const me = miembros.find(m => m.idUsuario === this.currentUserId);
                this.canSend = me?.rol === RolGrupo.ADMIN;
            },
            error: (err) => console.error('Error checking permissions', err)
        });
    }

    loadMessages(groupId: string) {
        this.isLoading = true;
        this.chatService.getMensajes(groupId).subscribe({
            next: (mensajes) => {
                this.messages = mensajes;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading messages', err);
                this.isLoading = false;
            }
        });
    }

    sendMessage() {
        if (!this.newMessage.trim() || !this.selectedConversation || !this.canSend) return;

        this.chatService.enviarMensajeAlGrupo(this.selectedConversation.id, this.newMessage).subscribe({
            next: (msg) => {
                this.messages.push(msg);
                this.newMessage = '';
            },
            error: (err) => console.error('Error sending message', err)
        });
    }

    isMine(msg: MensajeGrupoResponse): boolean {
        return msg.idUsuarioRemitente === this.currentUserId;
    }
}
