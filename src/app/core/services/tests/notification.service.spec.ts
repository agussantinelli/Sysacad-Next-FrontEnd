import { TestBed } from '@angular/core/testing';
import { NotificationService } from '../notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        });

        service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show success message', () => {
        service.showSuccess('Success');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Success', 'Cerrar', jasmine.objectContaining({
            panelClass: ['success-snackbar']
        }));
    });

    it('should show error message', () => {
        service.showError('Error');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Error', 'Cerrar', jasmine.objectContaining({
            panelClass: ['error-snackbar']
        }));
    });

    it('should show info message', () => {
        service.showInfo('Info');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Info', 'Cerrar', jasmine.objectContaining({
            panelClass: ['info-snackbar']
        }));
    });
});

