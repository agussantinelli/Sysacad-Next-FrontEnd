---
name: test
description: Guidelines for frontend component and E2E testing in Sysacad-Next.
---

# Testing (Sysacad-Next)

## Context
Quality assurance in the frontend involves checking both individual component logic and overall flows using Jasmine and Karma.

## Guidelines
1. **Component Testing**: Use Jasmine + Karma for unit testing UI components, services, and pipes.
2. **Naming**: Test files must follow the `.spec.ts` naming convention.
3. **Location**: `.spec.ts` files must be adjacent to the file they test.
4. **Mocking**: Use Jasmine Spies or Mock classes to isolate components from their dependencies (especially services).
5. **Coverage**: Focus on covering business logic, data transformations, and edge cases in services.
