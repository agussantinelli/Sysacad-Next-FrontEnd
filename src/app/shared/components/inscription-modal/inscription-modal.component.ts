import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComisionResponse } from '@core/models/comision.models';
import { DetalleMesaExamenResponse } from '@core/models/detalle-mesa-examen.models';

@Component({
    selector: 'app-inscription-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './inscription-modal.component.html',
    styleUrls: ['./styles/inscription-modal.component.css']
})
export class InscriptionModalComponent {
    // Mode 1: Commission Selection (Course Inscription)
    @Input() commissions: ComisionResponse[] = [];

    // Mode 2: Exam Confirmation (Exam Inscription)
    @Input() examDetail: DetalleMesaExamenResponse | null = null;

    // Common
    @Input() title: string = '';
    @Output() close = new EventEmitter<void>();

    // Output for Course
    @Output() selectCommission = new EventEmitter<ComisionResponse>();

    // Output for Exam
    @Output() confirmExam = new EventEmitter<void>();

    selectedCommission: ComisionResponse | null = null;

    onSelectCommission(commission: ComisionResponse) {
        this.selectedCommission = commission;
    }

    confirm() {
        if (this.examDetail) {
            this.confirmExam.emit();
        } else if (this.selectedCommission) {
            this.selectCommission.emit(this.selectedCommission);
        }
    }

    onClose() {
        this.close.emit();
    }
}
