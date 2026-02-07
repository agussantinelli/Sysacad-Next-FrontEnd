import { Component, OnInit } from '@angular/core';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
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
    imports: [CommonModule, PageLayoutComponent, FormsModule, LoadingSpinnerComponent, ChatWindowComponent],
    templateUrl: './messages.component.html',
    styleUrl: './styles/messages.component.css'
})
export class MessagesComponent implements OnInit {

    conversations: GrupoResponse[] = [];
    selectedConversation: GrupoResponse | null = null;
    messages: MensajeGrupoResponse[] = [];
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
        this.loadMessages(conversation.id);
        this.checkPermissions(conversation.id);
        this.chatService.marcarLeido(conversation.id).subscribe({
            next: () => conversation.mensajesSinLeer = 0
        });
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
            next: (response: any) => {
                console.log('Mensajes: Datos recibidos del chat:', response);
                // The API returns a Page object with a 'content' field
                this.messages = response.content || response || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading messages', err);
                this.isLoading = false;
            }
        });
    }

    onSendMessage(content: string) {
        if (!content.trim() || !this.selectedConversation || !this.canSend) return;

        if (this.currentUserRol === RolUsuario.PROFESOR && this.selectedConversation.idComision && this.selectedConversation.idMateria) {
            this.chatService.enviarMensajeComisionMateria({
                idComision: this.selectedConversation.idComision,
                idMateria: this.selectedConversation.idMateria,
                contenido: content
            }).subscribe({
                next: (msg) => {
                    this.messages.push(msg);
                    if (this.selectedConversation) {
                        this.selectedConversation.esVisible = true;
                        this.selectedConversation.horaUltimoMensaje = msg.fechaEnvio;
                        // Aseguramos que el ID se actualice si era un placeholder
                        if (msg.idGrupo && this.selectedConversation.id !== msg.idGrupo) {
                            this.selectedConversation.id = msg.idGrupo;
                        }
                    }
                    // Refrescamos la referencia para disparar la reactividad de los getters
                    this.conversations = [...this.conversations];
                },
                error: (err) => console.error('Error sending professor message', err)
            });
        } else {
            this.chatService.enviarMensajeAlGrupo(this.selectedConversation.id, content).subscribe({
                next: (msg) => {
                    this.messages.push(msg);
                    if (this.selectedConversation) {
                        this.selectedConversation.esVisible = true;
                        this.selectedConversation.horaUltimoMensaje = msg.fechaEnvio;
                    }
                    // Refrescamos la referencia para disparar la reactividad de los getters
                    this.conversations = [...this.conversations];
                },
                error: (err) => console.error('Error sending message', err)
            });
        }
    }



    get activeConversations(): GrupoResponse[] {
        return [...(this.conversations || [])]
            .filter(c => c && c.esVisible)
            .sort((a, b) => {
                const dateA = new Date(a.horaUltimoMensaje || a.fechaCreacion).getTime();
                const dateB = new Date(b.horaUltimoMensaje || b.fechaCreacion).getTime();
                return dateB - dateA;
            });
    }

    get sortedConversations(): GrupoResponse[] {
        return [...(this.conversations || [])].sort((a, b) => {
            const dateA = new Date(a.horaUltimoMensaje || a.fechaCreacion).getTime();
            const dateB = new Date(b.horaUltimoMensaje || b.fechaCreacion).getTime();
            return dateB - dateA;
        });
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
