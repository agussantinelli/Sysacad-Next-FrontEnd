import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionModalComponent } from './inscription-modal.component';

describe('InscriptionModalComponent', () => {
    let component: InscriptionModalComponent;
    let fixture: ComponentFixture<InscriptionModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InscriptionModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(InscriptionModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should handle body overflow on lifecycle', () => {
        component.ngOnInit();
        expect(document.body.style.overflow).toBe('hidden');
        component.ngOnDestroy();
        expect(document.body.style.overflow).toBe('auto');
    });

    it('should select commission and clear exam table', () => {
        const mockComm = { id: 1 } as any;
        component.onSelectCommission(mockComm);
        expect(component.selectedCommission).toBe(mockComm);
        expect(component.selectedExamTable).toBeNull();
    });

    it('should select exam table and clear commission', () => {
        const mockTable = { id: 1 } as any;
        component.onSelectExamTable(mockTable);
        expect(component.selectedExamTable).toBe(mockTable);
        expect(component.selectedCommission).toBeNull();
    });

    it('should emit confirmExam if examDetail is present', () => {
        spyOn(component.confirmExam, 'emit');
        component.examDetail = { id: 1 } as any;
        component.confirm();
        expect(component.confirmExam.emit).toHaveBeenCalled();
    });

    it('should emit selectCommission if commission is selected', () => {
        spyOn(component.selectCommission, 'emit');
        const mockComm = { id: 1 } as any;
        component.selectedCommission = mockComm;
        component.confirm();
        expect(component.selectCommission.emit).toHaveBeenCalledWith(mockComm);
    });

    it('should emit selectExamTable if table is selected', () => {
        spyOn(component.selectExamTable, 'emit');
        const mockTable = { id: 1 } as any;
        component.selectedExamTable = mockTable;
        component.confirm();
        expect(component.selectExamTable.emit).toHaveBeenCalledWith(mockTable);
    });

    it('should emit close on onClose', () => {
        spyOn(component.close, 'emit');
        component.onClose();
        expect(component.close.emit).toHaveBeenCalled();
    });
});
