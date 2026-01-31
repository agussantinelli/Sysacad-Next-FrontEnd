import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

@Component({
    selector: 'app-alert-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert-message.component.html',
    styleUrl: './styles/alert-message.component.css'
})
export class AlertMessageComponent {
    @Input() message: string = '';
    @Input() type: AlertType = 'info';
    @Output() close = new EventEmitter<void>();

    get icon(): string {
        switch (this.type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'info': return 'info';
            case 'warning': return 'warning';
            default: return 'info';
        }
    }

    onClose() {
        this.close.emit();
    }
}
