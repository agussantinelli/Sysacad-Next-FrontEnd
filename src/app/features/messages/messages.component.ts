import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs/operators';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ActivatedRoute } from '@angular/router';

import { ChatService } from '@core/services/chat.service';
import { AuthService } from '@core/services/auth.service';
import { GrupoResponse, MensajeGrupoResponse, MiembroGrupoResponse } from '@core/models/messaging.models';
import { RolGrupo } from '@core/enums/grupo.enums';
import { RolUsuario } from '@core/enums/usuario.enums';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, FormsModule, LoadingSpinnerComponent],
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
    currentUserRol: string | null = null;
    canSend = false;
    loadingGroups = false;

    constructor(
        private chatService: ChatService,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadGroups();
    }

    loadGroups() {
        this.loadingGroups = true;
        this.authService.currentUser$.pipe(
            filter(user => !!user),
            switchMap(user => {
                this.currentUserId = user!.id;
                this.currentUserRol = user!.rol;

                if (user!.rol === RolUsuario.ESTUDIANTE) {
                    console.log('Mensajes: Llamando a /grupos/alumno');
                    return this.chatService.getGruposAlumno();
                } else if (user!.rol === RolUsuario.PROFESOR) {
                    console.log('Mensajes: Llamando a /grupos/profesor');
                    return this.chatService.getGruposProfesor();
                } else {
                    console.log('Mensajes: Llamando a /grupos/mis-grupos');
                    return this.chatService.getMisGrupos();
                }
            })
        ).subscribe({
            next: (grupos) => {
                console.log('Mensajes: Datos recibidos del endpoint:', grupos);
                this.conversations = grupos || [];
                this.loadingGroups = false;

                // Handle deep linking
                const idComision = this.route.snapshot.queryParamMap.get('idComision');
                if (idComision) {
                    const targetGroup = this.conversations.find(g => g.idComision === idComision);
                    if (targetGroup) {
                        this.selectConversation(targetGroup);
                    }
                }
            },
            error: (err) => {
                console.error('Error loading groups', err);
                this.loadingGroups = false;
            }
        });
    }

    selectConversation(conversation: GrupoResponse) {
        this.selectedConversation = conversation;
        if (conversation.esVisible) {
            this.loadMessages(conversation.id);
            this.checkPermissions(conversation.id);
            this.chatService.marcarLeido(conversation.id).subscribe();
        } else {
            this.messages = [];
            this.canSend = false;
        }
    }

    checkPermissions(groupId: string) {
        this.chatService.getMiembros(groupId).subscribe({
            next: (miembros) => {
                const safeMiembros = miembros || [];
                const me = safeMiembros.find(m => m.idUsuario === this.currentUserId);
                this.canSend = me?.rol === RolGrupo.ADMIN;
            },
            error: (err) => console.error('Error checking permissions', err)
        });
    }

    loadMessages(groupId: string) {
        this.isLoading = true;
        this.chatService.getMensajes(groupId).subscribe({
            next: (mensajes) => {
                this.messages = mensajes || [];
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

        if (this.currentUserRol === RolUsuario.PROFESOR && this.selectedConversation.idComision && this.selectedConversation.idMateria) {
            this.chatService.enviarMensajeComisionMateria({
                idComision: this.selectedConversation.idComision,
                idMateria: this.selectedConversation.idMateria,
                contenido: this.newMessage
            }).subscribe({
                next: (msg) => {
                    this.messages.push(msg);
                    this.newMessage = '';
                },
                error: (err) => console.error('Error sending professor message', err)
            });
        } else {
            this.chatService.enviarMensajeAlGrupo(this.selectedConversation.id, this.newMessage).subscribe({
                next: (msg) => {
                    this.messages.push(msg);
                    this.newMessage = '';
                },
                error: (err) => console.error('Error sending message', err)
            });
        }
    }

    isMine(msg: MensajeGrupoResponse): boolean {
        return msg.idUsuarioRemitente === this.currentUserId;
    }

    get activeConversations(): GrupoResponse[] {
        return (this.conversations || []).filter(c => c && c.esVisible);
    }

    get inactiveConversations(): GrupoResponse[] {
        return (this.conversations || [])
            .filter(c => c && !c.esVisible)
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    isToday(date: any): boolean {
        if (!date) return false;
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    }
}
