import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../page-layout/page-layout.component';

@Component({
    selector: 'app-construction',
    standalone: true,
    imports: [CommonModule, PageLayoutComponent],
    template: `
    <app-page-layout title="Función No Disponible">
      <div class="construction-container">
        <div class="icon-wrapper">
          <span class="material-icons">engineering</span>
        </div>
        <h2>En Construcción</h2>
        <p>Esta funcionalidad aún no está disponible.</p>
        <p class="subtitle">Estamos trabajando para habilitarla pronto.</p>
      </div>
    </app-page-layout>
  `,
    styles: [`
    .construction-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      margin-top: 2rem;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .material-icons {
      font-size: 48px;
      color: #9ca3af;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .subtitle {
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }
  `]
})
export class ConstructionComponent { }
