import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrelativaDTO } from '@core/models/estudiante-materia.models';

@Component({
    selector: 'app-correlatives-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './correlatives-modal.component.html',
    styleUrls: ['./styles/correlatives-modal.component.css']
})
export class CorrelativesModalComponent implements OnInit, OnDestroy {
    @Input() subjectName: string = '';
    @Input() correlatives: CorrelativaDTO[] = [];
    @Output() close = new EventEmitter<void>();

    ngOnInit(): void {
        document.body.style.overflow = 'hidden';
    }

    ngOnDestroy(): void {
        document.body.style.overflow = 'auto';
    }

    onClose() {
        this.close.emit();
    }
}
