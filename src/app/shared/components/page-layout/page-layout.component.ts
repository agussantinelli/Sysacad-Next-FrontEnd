import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-page-layout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-layout.component.html',
    styleUrls: ['./styles/page-layout.component.css']
})
export class PageLayoutComponent {
    @Input() title: string = '';
    private location = inject(Location);

    goBack(): void {
        this.location.back();
    }
}
