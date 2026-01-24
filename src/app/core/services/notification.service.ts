import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private snackBar = inject(MatSnackBar);

    showError(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
        });
    }

    showSuccess(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
        });
    }

    showInfo(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['info-snackbar']
        })
    }
}
