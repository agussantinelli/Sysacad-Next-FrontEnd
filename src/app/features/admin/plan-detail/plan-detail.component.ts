import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AdminService } from '@core/services/admin.service';
import { AlertService } from '@core/services/alert.service';
import { MateriaDetalleDTO, PlanDetalleDTO } from '@core/models/admin.models';

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

    
    pageTitle: string = 'Cargando...';

    
    careerName: string = '';
    groupedMaterias: { [key: number]: MateriaDetalleDTO[] } = {};
    years: number[] = [];

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.carreraId = params.get('carreraId') || '';
            const anioStr = params.get('anio');
            this.anio = anioStr ? parseInt(anioStr, 10) : 0;

            if (this.carreraId && this.anio) {
                this.loadData();
            } else {
                this.alertService.error('Información del plan inválida');
                this.router.navigate(['/admin/careers']);
            }
        });
    }

    loadData() {
        this.isLoading = true;
        
        this.loadCareerInfo();
        this.loadPlan();
    }

    loadCareerInfo() {
        
        
        this.adminService.getAllCarreras().subscribe({
            next: (carreras) => {
                const carrera = carreras.find(c => c.id === this.carreraId);
                if (carrera) {
                    this.careerName = carrera.nombre;
                    this.updateTitle();
                }
            },
            error: (err) => console.error('Error loading career info', err)
        });
    }

    loadPlan() {
        this.adminService.getPlanDetalle(this.carreraId, this.anio).subscribe({
            next: (data) => {
                this.plan = data;
                this.processMaterias();
                this.updateTitle();
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Error al cargar detalle del plan');
                this.isLoading = false;
            }
        });
    }

    updateTitle() {
        if (this.plan && this.careerName) {
            this.pageTitle = `${this.careerName} - ${this.plan.nombre}`;
        } else if (this.plan) {
            this.pageTitle = this.plan.nombre;
        }
    }

    processMaterias() {
        if (!this.plan) return;

        this.groupedMaterias = {};
        this.plan.materias.forEach(materia => {
            if (!this.groupedMaterias[materia.nivel]) {
                this.groupedMaterias[materia.nivel] = [];
            }
            this.groupedMaterias[materia.nivel].push(materia);
        });

        this.years = Object.keys(this.groupedMaterias)
            .map(Number)
            .sort((a, b) => a - b);
    }

    goBack() {
        this.router.navigate(['/admin/careers']);
    }
}
