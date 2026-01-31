import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AlertService } from '@core/services/alert.service';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-page-layout',
    standalone: true,
    imports: [CommonModule, AlertMessageComponent],
    templateUrl: './page-layout.component.html',
    styleUrls: ['./styles/page-layout.component.css']
})
export class PageLayoutComponent {
    @Input() title: string = '';
    private location = inject(Location);
    public alertService = inject(AlertService);

    goBack(): void {
        this.alertService.clear(); // Clear alerts on navigation
        this.location.back();
    }
}
