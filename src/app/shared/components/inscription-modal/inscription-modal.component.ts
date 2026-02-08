import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComisionDisponibleDTO } from '@core/models/comision-disponible.models';
import { DetalleMesaExamenResponse } from '@core/models/detalle-mesa-examen.models';
import { MesaExamenDisponibleDTO } from '@core/models/mesa-examen-disponible.models';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

@Component({
    selector: 'app-inscription-modal',
    standalone: true,
    imports: [CommonModule, DateFormatPipe],
    templateUrl: './inscription-modal.component.html',
    styleUrls: ['./styles/inscription-modal.component.css']
})
export class InscriptionModalComponent implements OnInit, OnDestroy {
    
    @Input() commissions: ComisionDisponibleDTO[] = [];

    
    @Input() examDetail: DetalleMesaExamenResponse | null = null;

    
    @Input() title: string = '';
    @Output() close = new EventEmitter<void>();

    
    @Output() selectCommission = new EventEmitter<ComisionDisponibleDTO>();

    
    @Output() selectExamTable = new EventEmitter<MesaExamenDisponibleDTO>();

    
    @Output() confirmExam = new EventEmitter<void>();

    selectedCommission: ComisionDisponibleDTO | null = null;
    selectedExamTable: MesaExamenDisponibleDTO | null = null;

    @Input() examTables: MesaExamenDisponibleDTO[] = [];

    ngOnInit(): void {
        document.body.style.overflow = 'hidden';
    }

    ngOnDestroy(): void {
        document.body.style.overflow = 'auto';
    }

    onSelectCommission(commission: ComisionDisponibleDTO) {
        this.selectedCommission = commission;
        this.selectedExamTable = null;
    }

    onSelectExamTable(table: MesaExamenDisponibleDTO) {
        this.selectedExamTable = table;
        this.selectedCommission = null;
    }

    confirm() {
        if (this.examDetail) {
            this.confirmExam.emit();
        } else if (this.selectedCommission) {
            this.selectCommission.emit(this.selectedCommission);
        } else if (this.selectedExamTable) {
            this.selectExamTable.emit(this.selectedExamTable);
        }
    }

    onClose() {
        this.close.emit();
    }
}
