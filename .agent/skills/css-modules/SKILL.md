---
name: css-modules
description: Guidelines for implementing CSS Modules in Angular components for better maintainability and scoped styling.
---

# Scoped CSS Skill (Angular)

## Context
Angular provides built-in support for scoped styling. Each component should have its own CSS file to ensure styles don't leak.

## Guidelines

1. **Extraction Rule**: Every component must have its own CSS file. If styles exceed 50 lines, consider breaking down the component.
2. **Directory Structure**: 
    - Styles should be placed in a `styles/` subdirectory adjacent to the component or in the same folder if simple.
    - Standard path: `src/app/features/[feature]/[component]/styles/[component].component.css`.
3. **Naming Convention**: 
    - Use `kebab-case` matching the component name.
    - Extension: `.component.css`.
4. **Integration**:
    - Reference the style file in the `@Component` decorator:
      ```typescript
      @Component({
        selector: 'app-my-component',
        standalone: true,
        styleUrl: './styles/my-component.component.css',
        templateUrl: './my-component.component.html'
      })
      ```
5. **Class Naming**: Use BEM (Block Element Modifier) or a similar convention to maintain readability within the file.

## Example

### Component Structure
```
src/app/features/admin/plan-detail/
├── plan-detail.component.ts
├── plan-detail.component.html
└── styles/
    └── plan-detail.component.css
```
```
