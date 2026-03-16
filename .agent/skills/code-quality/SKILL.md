---
name: code-quality
description: Guidelines for clean code, readability, and the "No Comments" policy.
---

# Code Quality Skill (Sysacad-Next)

## Context
Clean code is essential for maintainable Angular components.

## Guidelines
1. **NO COMMENTS**: The code should explain itself. Do not comment on what a component or a service does; use clear names instead.
   - *Example*: Use `isUserLoggedIn` instead of `const logged = true; // checks if user is logged`.
2. **Remove Dead Code**: Never leave commented-out code blocks in components.
3. **Self-Documenting Inputs/Outputs**: Use clear `@Input()` and `@Output()` names and TypeScript types to make component usage clear.
4. **Consistency**: Use the same patterns for state management (Signals) and data fetching across the app.
