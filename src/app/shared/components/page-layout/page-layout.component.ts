import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';

@Component({
    selector: 'app-page-layout',
    standalone: true,
    imports: [CommonModule, AlertMessageComponent],
    templateUrl: './page-layout.component.html',
    styleUrls: ['./styles/page-layout.component.css']
})
export class PageLayoutComponent {
    @Input() title: string = '';
    @Input() backRoute: string | any[] | null = null;

    private location = inject(Location);
    private router = inject(Router);
    public alertService = inject(AlertService);

    goBack(): void {
        this.alertService.clear(); // Clear alerts on navigation
        if (this.backRoute) {
            const commands = Array.isArray(this.backRoute) ? this.backRoute : [this.backRoute];
            this.router.navigate(commands);
        } else {
            this.location.back();
        }
    }
}
