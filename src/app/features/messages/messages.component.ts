import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';

// Mock Models
interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    isMine: boolean;
}

interface Conversation {
    id: string;
    name: string;
    avatar: string; // URL or placeholder
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    online: boolean;
}

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, FormsModule],
    templateUrl: './messages.component.html',
    styleUrl: './styles/messages.component.css'
})
export class MessagesComponent implements OnInit {

    conversations: Conversation[] = [];
    selectedConversation: Conversation | null = null;
    messages: Message[] = [];
    newMessage: string = '';

    ngOnInit(): void {
        // Mock Data Initialization
        this.conversations = [
            {
                id: '1',
                name: 'Bedelía',
                avatar: 'assets/avatars/default.png',
                lastMessage: 'Su trámite ha sido aprobado.',
                lastMessageTime: new Date(new Date().getTime() - 1000 * 60 * 30), // 30 mins ago
                unreadCount: 1,
                online: true
            },
            {
                id: '2',
                name: 'Prof. Garcia',
                avatar: 'assets/avatars/default.png',
                lastMessage: 'Recuerden traer el TP impreso.',
                lastMessageTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 day ago
                unreadCount: 0,
                online: false
            },
            {
                id: '3',
                name: 'Soporte Técnico',
                avatar: 'assets/avatars/default.png',
                lastMessage: '¿Pudiste restablecer tu contraseña?',
                lastMessageTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 48), // 2 days ago
                unreadCount: 0,
                online: true
            }
        ];

        // Auto select first for demo
        // this.selectConversation(this.conversations[0]);
    }

    selectConversation(conversation: Conversation) {
        this.selectedConversation = conversation;
        conversation.unreadCount = 0; // Mark as read
        this.loadMockMessages(conversation.id);
    }

    loadMockMessages(conversationId: string) {
        // Simulate message loading
        this.messages = [
            {
                id: 'm1',
                senderId: 'other',
                content: 'Hola, ¿cómo estás?',
                timestamp: new Date(new Date().getTime() - 1000 * 60 * 60),
                isMine: false
            },
            {
                id: 'm2',
                senderId: 'me',
                content: 'Hola! Todo bien, quería consultar sobre el certificado.',
                timestamp: new Date(new Date().getTime() - 1000 * 60 * 50),
                isMine: true
            },
            {
                id: 'm3',
                senderId: 'other',
                content: 'Sí, dime. ¿Cuál es tu duda?',
                timestamp: new Date(new Date().getTime() - 1000 * 60 * 45),
                isMine: false
            }
        ];
    }

    sendMessage() {
        if (!this.newMessage.trim() || !this.selectedConversation) return;

        const msg: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            content: this.newMessage,
            timestamp: new Date(),
            isMine: true
        };

        this.messages.push(msg);
        this.newMessage = '';

        // Mock scroll to bottom logic here
    }
}
