import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
    @Input() title: string = 'Confirmar Operación';
    @Input() message: string = '¿Estás seguro de continuar?';
    @Input() confirmText: string = 'Confirmar';
    @Input() cancelText: string = 'Cancelar';
    @Input() type: 'primary' | 'danger' | 'warning' = 'primary';

    @Output() confirm = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    ngOnInit(): void {
        document.body.style.overflow = 'hidden';
    }

    ngOnDestroy(): void {
        document.body.style.overflow = 'auto';
    }

    onConfirm() {
        this.confirm.emit();
    }

    onClose() {
        this.close.emit();
    }
}
