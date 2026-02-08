import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { CalendarioService } from '@core/services/calendario.service';


@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent],
    templateUrl: './calendar.component.html',
    styleUrl: './styles/calendar.component.css'
})
export class CalendarComponent {
    private calendarioService = inject(CalendarioService);
    
    
    

    isLoading = false;

    downloadCalendar() {
        this.isLoading = true;
        this.calendarioService.getCalendarioPdf().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Calendario_Academico.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error downloading calendar', err);
                this.isLoading = false;
                
            }
        });
    }
}
