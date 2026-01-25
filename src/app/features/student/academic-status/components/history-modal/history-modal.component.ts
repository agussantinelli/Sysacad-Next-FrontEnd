import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './history-modal.component.html',
    styleUrls: ['./styles/history-modal.component.css']
})
export class HistoryModalComponent {
    @Input() materia: any;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
