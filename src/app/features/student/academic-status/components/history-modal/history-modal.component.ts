import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './history-modal.component.html',
    styleUrls: ['./styles/history-modal.component.css']
})
export class HistoryModalComponent implements OnInit {
    @Input() materia: any;
    @Output() close = new EventEmitter<void>();

    ngOnInit(): void {
        console.log('📊 [History Modal] Data received for:', this.materia?.nombre);
        console.log('   - Exams:', this.materia?.historyExams);
        console.log('   - Cursadas:', this.materia?.historyCursadas);
    }

    onClose() {
        this.close.emit();
    }
}
