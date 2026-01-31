import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
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
    @Input() subjectId: string | null = null; // To filter professors by subject
    @Output() close = new EventEmitter<void>();

    // Output for Course
    @Output() selectCommission = new EventEmitter<ComisionResponse>();

    // Output for Exam
    @Output() confirmExam = new EventEmitter<void>();

    selectedCommission: ComisionResponse | null = null;

    onSelectCommission(commission: ComisionResponse) {
        this.selectedCommission = commission;
    }

    getProfesoresForSubject(comision: ComisionResponse): string {
        if (!this.subjectId || !comision.materiasDetalle) {
            return 'Sin asignar';
        }

        const detalle = comision.materiasDetalle.find(d => d.idMateria === this.subjectId);

        if (detalle && detalle.profesores && detalle.profesores.length > 0) {
            return detalle.profesores.map(p => p.nombreCompleto).join(', ');
        }

        return 'Sin asignar';
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
