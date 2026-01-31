import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComisionResponse } from '@core/models/comision.models';

@Component({
    selector: 'app-commission-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './commission-modal.component.html',
    styleUrls: ['./styles/commission-modal.component.css']
})
export class CommissionModalComponent {
    @Input() commissions: ComisionResponse[] = [];
    @Input() materiaNombre: string = '';
    @Output() close = new EventEmitter<void>();
    @Output() select = new EventEmitter<ComisionResponse>();

    selectedCommission: ComisionResponse | null = null;

    onSelect(commission: ComisionResponse) {
        this.selectedCommission = commission;
    }

    confirm() {
        if (this.selectedCommission) {
            this.select.emit(this.selectedCommission);
        }
    }

    onClose() {
        this.close.emit();
    }
}
