import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, ActionEvent, TableAction } from '../../interfaces/table.interface';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.component.html',
    styleUrls: ['./styles/table.component.css']
})
export class TableComponent implements OnChanges {
    protected Math = Math;
    @Input() data: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() actions: TableAction[] = [];
    @Input() pageSize: number = 10;
    @Output() onAction = new EventEmitter<ActionEvent>();

    // Pagination state
    currentPage: number = 1;
    totalPages: number = 1;

    // Sorting state
    sortColumn: string | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';

    // Internal data to display
    displayData: any[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['pageSize']) {
            this.updateDisplayData();
        }
    }

    getCellValue(row: any, column: TableColumn): any {
        if (!row || !column.key) return '';
        return column.key.split('.').reduce((obj, key) => obj?.[key], row);
    }

    emitAction(actionName: string, row: any) {
        this.onAction.emit({ action: actionName, row });
    }

    updateDisplayData() {
        this.totalPages = Math.ceil(this.data.length / this.pageSize);
        // Ensure current page is valid
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }

        let processedData = [...this.data];

        // Apply sorting
        if (this.sortColumn) {
            processedData.sort((a, b) => {
                const valueA = this.getCellValue(a, { key: this.sortColumn!, label: '' });
                const valueB = this.getCellValue(b, { key: this.sortColumn!, label: '' });

                if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
                if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.displayData = processedData.slice(startIndex, startIndex + this.pageSize);
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updateDisplayData();
        }
    }

    sort(column: TableColumn) {
        if (!column.sortable) return;

        if (this.sortColumn === column.key) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column.key;
            this.sortDirection = 'asc';
        }
        this.updateDisplayData();
    }
}
