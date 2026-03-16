---
name: angular-components
description: Guidelines for creating and organizing Angular standalone components in Sysacad-Next.
---

# Angular Components Skill

## Context
Sysacad-Next uses Angular 19 with **Standalone Components**. Components should be modular, testable, and follow the project's directory structure.

## Structure
Every component should have its own directory containing:
1.  **Logic** (`.component.ts`): Standalone component definition.
2.  **Template** (`.component.html`): Semantic HTML5.
3.  **Styles** (`styles/*.component.css`): Scoped CSS (following the Scoped CSS skill).
4.  **Tests** (`.component.spec.ts`): Unit tests using Jasmine.

## Guidelines
1.  **Standalone**: Always set `standalone: true`.
2.  **Signals**: Use **Signals** for local state and reactive inputs/outputs where possible.
3.  **Naming**: Use `kebab-case` for file and folder names.
4.  **Separation of Concerns**: Templates and styles MUST be in separate files (avoid inline templates/styles for complex components).
5.  **Imports**: Only import necessary modules in the `imports` array of the `@Component` decorator.

## Example
### Directory structure:
```
src/app/features/dashboard/
├── dashboard.component.ts
├── dashboard.component.html
├── dashboard.component.spec.ts
└── styles/
    └── dashboard.component.css
```

### Component Definition:
```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './styles/dashboard.component.css'
})
export class DashboardComponent {
  title = signal('Sysacad Next Dashboard');
}
```
