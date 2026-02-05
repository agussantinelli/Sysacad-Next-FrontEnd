import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { PlanDetalleDTO } from '@core/models/admin.models';

@Component({
    selector: 'app-admin-plan-detail',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent, LoadingSpinnerComponent],
    templateUrl: './plan-detail.component.html',
    styleUrl: './styles/plan-detail.component.css'
})
export class AdminPlanDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private adminService = inject(AdminService);
    private alertService = inject(AlertService);

    carreraId: string = '';
    anio: number = 0;
    plan: PlanDetalleDTO | null = null;
    isLoading = true;

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.carreraId = params.get('carreraId') || '';
            const anioStr = params.get('anio');
            this.anio = anioStr ? parseInt(anioStr, 10) : 0;

            if (this.carreraId && this.anio) {
                this.loadPlan();
            } else {
                this.alertService.error('Información del plan inválida');
                this.router.navigate(['/admin/careers']);
            }
        });
    }

    loadPlan() {
        this.isLoading = true;
        this.adminService.getPlanDetalle(this.carreraId, this.anio).subscribe({
            next: (data) => {
                this.plan = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar detalle del plan');
                this.isLoading = false;
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/careers']);
    }
}
