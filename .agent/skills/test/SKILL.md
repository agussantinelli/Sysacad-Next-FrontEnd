---
name: test
description: Guidelines for frontend component and E2E testing in Sysacad-Next.
---

# Testing (Sysacad-Next)

## Context
Quality assurance in the frontend involves checking both individual component logic and overall flows using Jasmine and Karma.

## Guidelines
1. **Architecture**: Refer to the **[testing-architecture](file:///c:/Users/Agus/Documents/Sysacad-Next/Sysacad-Next-FrontEnd/.agent/skills/testing-architecture/SKILL.md)** for a full overview of test tiers and locations.
2. **Component Testing**: Use Jasmine + Karma for unit testing UI components, services, and pipes. Files must be adjacent to the source.
314. **Integration Testing**: Use Karma + ATL for testing interactions between modules. See **[integration-testing](file:///c:/Users/Agus/Documents/Sysacad-Next/Sysacad-Next-FrontEnd/.agent/skills/integration-testing/SKILL.md)**.
15. **Naming**: 
   - Unit: `.spec.ts` (adjacent).
   - Integration: `.integration.test.ts` (inside `tests/integration/`).
   - E2E: `*.cy.ts` (inside `tests/e2e/`).
16. **Mocking**: Use Jasmine Spies/Mocks.
17. **Commands**:
   - `pnpm test`: Run ALL tests (Unit + Integration).
   - `pnpm test:unit`: Run only unit tests (Jasmine/Karma).
   - `pnpm test:integration`: Run only integration tests (Jasmine/Karma).
   - `pnpm test:e2e`: Run Cypress tests in headless mode.
   - `pnpm e2e:open`: Open Cypress GUI.
