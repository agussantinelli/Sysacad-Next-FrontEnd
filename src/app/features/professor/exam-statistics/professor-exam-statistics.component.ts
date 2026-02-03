import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';

@Component({
    selector: 'app-professor-exam-statistics',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent],
    templateUrl: './professor-exam-statistics.component.html',
    styleUrls: ['./styles/professor-exam-statistics.component.css']
})
export class ProfessorExamStatisticsComponent { }
