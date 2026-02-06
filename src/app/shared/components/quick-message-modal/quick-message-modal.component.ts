import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@core/services/chat.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from '../alert-message/alert-message.component';

@Component({
    selector: 'app-quick-message-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingSpinnerComponent, AlertMessageComponent],
    templateUrl: './quick-message-modal.component.html',
    styleUrls: ['./styles/quick-message-modal.component.css']
})
export class QuickMessageModalComponent implements OnInit, OnDestroy {
    private chatService = inject(ChatService);

    @Input() idComision!: string;
    @Input() targetName: string = '';

    @Output() close = new EventEmitter<void>();
    @Output() sent = new EventEmitter<void>();

    message: string = '';
    isLoading = false;
    error: string | null = null;
    success: boolean = false;

    ngOnInit(): void {
        document.body.style.overflow = 'hidden';
    }

    ngOnDestroy(): void {
        document.body.style.overflow = 'auto';
    }

    onClose() {
        if (!this.isLoading) {
            this.close.emit();
        }
    }

    sendMessage() {
        if (!this.message.trim() || this.isLoading) return;

        this.isLoading = true;
        this.error = null;

        this.chatService.enviarMensajeAlGrupo(this.idComision, this.message).subscribe({
            next: () => {
                this.isLoading = false;
                this.success = true;
                setTimeout(() => {
                    this.sent.emit();
                    this.onClose();
                }, 1500);
            },
            error: (err) => {
                console.error('Error sending quick message', err);
                this.error = 'No se pudo enviar el mensaje. Reintente.';
                this.isLoading = false;
            }
        });
    }
}
