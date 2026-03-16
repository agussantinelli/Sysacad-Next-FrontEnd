---
name: modular-architecture
description: Guidelines for maintaining a modular architecture in Sysacad-Next Frontend
---
# Modular Architecture Guidelines

This project follows a strict modular architecture to ensure scalability and maintainability.

## Core Rules

1.  **Type Separation**:
    *   **NEVER** define types or interfaces inside service files or components.
    *   **ALWAYS** create a dedicated file or use `src/app/core/models/` for shared types.
    *   Use `interface` for data structures that might need extension.

2.  **Service Layer**:
    *   Services (`src/app/core/services/` or feature-specific services) should only contain API calls and data transformation logic.
    *   They must import types from core or shared models.
    *   They should not contain UI logic.
    *   Use Angular's `providedIn: 'root'` for singleton services.

3.  **Feature Layer**:
    *   Feature modules/components (`src/app/features/`) should encapsulate domain-specific logic.
    *   They should consume Core services for data fetching and actions.
    *   Complex validation or shared business logic should be extracted to `src/app/core/utils/` or shared services.

4.  **Components**:
    *   Components should focus on UI and template binding.
    *   They should use **Signals** for reactive state management where appropriate.
    *   They should import types from the model layer.

5.  **Directory Structure**:
    *   `src/app/core/models/`: Centralized type definitions.
    *   `src/app/core/services/`: API and global state services.
    *   `src/app/features/`: Domain-specific components and logic.
    *   `src/app/shared/`: Reusable UI components and pipes.
    *   `src/app/core/api/`: API client configurations.

## Example Workflow

When adding a new feature (e.g., "Courses"):
1.  Create types in `src/app/core/models/course.model.ts`.
2.  Create a service `src/app/core/services/course.service.ts` importing those types.
3.  Create feature components in `src/app/features/student/courses/`.
4.  Register routes in `src/app/app.routes.ts`.
