import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComisionDisponibleDTO } from '@core/models/comision-disponible.models';
import { MesaExamenDisponibleDTO } from '@core/models/mesa-examen-disponible.models';

import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
    selector: 'app-inscription-confirmation-modal',
    standalone: true,
    imports: [CommonModule, DateFormatPipe],
    templateUrl: './inscription-confirmation-modal.component.html',
    styleUrls: ['./styles/inscription-confirmation-modal.component.css']
})
export class InscriptionConfirmationModalComponent implements OnInit, OnDestroy {
    @Input() commission: ComisionDisponibleDTO | null = null;
    @Input() examTable: MesaExamenDisponibleDTO | null = null;
    @Input() subjectName: string = '';
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
