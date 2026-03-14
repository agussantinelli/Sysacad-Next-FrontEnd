import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
    });

    const mockData = [
        { id: 1, name: 'Zebra', category: { name: 'Animal' } },
        { id: 2, name: 'Apple', category: { name: 'Fruit' } },
        { id: 3, name: 'Banana', category: { name: 'Fruit' } }
    ];

    const mockColumns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'category.name', label: 'Category', sortable: true }
    ];

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should handle nested cell values', () => {
        const row = { category: { name: 'Fruit' } };
        const col = { key: 'category.name', label: 'Cat' };
        expect(component.getCellValue(row, col)).toBe('Fruit');
    });

    it('should update display data on input changes', () => {
        component.data = mockData;
        component.pageSize = 2;
        component.ngOnChanges({
            data: { currentValue: mockData, previousValue: [], firstChange: true, isFirstChange: () => true } as any
        });
        
        expect(component.totalPages).toBe(2);
        expect(component.displayData.length).toBe(2);
    });

    it('should sort data by column', () => {
        component.data = [...mockData];
        component.pageSize = 10;
        component.updateDisplayData();

        // Initial state
        expect(component.displayData[0].name).toBe('Zebra');

        // Sort by name ASC
        component.sort(mockColumns[1]); // name
        expect(component.sortColumn).toBe('name');
        expect(component.sortDirection).toBe('asc');
        expect(component.displayData[0].name).toBe('Apple');

        // Sort by name DESC
        component.sort(mockColumns[1]);
        expect(component.sortDirection).toBe('desc');
        expect(component.displayData[0].name).toBe('Zebra');
    });

    it('should change page correctly', () => {
        component.data = mockData;
        component.pageSize = 1;
        component.updateDisplayData();

        expect(component.totalPages).toBe(3);
        
        component.changePage(2);
        expect(component.currentPage).toBe(2);
        expect(component.displayData[0].id).toBe(2);

        component.changePage(5); // Out of bounds
        expect(component.currentPage).toBe(2);
    });

    it('should emit action', () => {
        spyOn(component.onAction, 'emit');
        const testRow = { id: 1 };
        component.emitAction('delete', testRow);
        expect(component.onAction.emit).toHaveBeenCalledWith({ action: 'delete', row: testRow });
    });

    it('should handle nested property sorting', () => {
        component.data = [...mockData];
        component.pageSize = 10;
        
        component.sort(mockColumns[2]); // category.name
        expect(component.displayData[0].category.name).toBe('Animal');
        
        component.sort(mockColumns[2]); // category.name DESC
        expect(component.displayData[0].category.name).toBe('Fruit');
    });
});
