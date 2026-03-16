---
name: clean-structure
description: Component organization and modern React principles for the FrontEnd.
---

# Clean Structure (Sysacad-Next)

## Context
A well-organized frontend is easier to maintain and scale. This project uses Angular 19 with Standalone Components.

## Guidelines
1. **Folders**:
   - `src/app/core`: Singleton services, guards, interceptors, and API client.
   - `src/app/features`: Domain-specific modules (Admin, Student, Professor).
   - `src/app/shared`: Reusable components, pipes, and interfaces.
   - `src/app/layout`: Application-wide layout components (Navbar, Sidebar).
   - `src/environments`: Environment configuration files.
2. **Logic separation**:
   - Keep components focused on UI and template binding.
   - Extract logic and state to **Services** (using Signals when appropriate).
   - Extract pure logic or formatting to **Utils**.
3. **Consistency**:
   - Use `kebab-case` for file names and folder names (e.g., `user-profile.component.ts`).
   - Use `PascalCase` for Component classes.
   - Use `camelCase` for methods and variables.
4. **Testing**: Every logic file (services, utils) and UI component MUST have a corresponding `.spec.ts` file.
