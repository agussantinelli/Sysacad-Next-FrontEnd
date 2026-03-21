---
name: integration-testing
description: Guidelines for frontend integration testing using Vitest and Angular Testing Library.
---

# 🔗 Frontend Integration Testing

Integration tests in the Sysacad-Next FrontEnd focus on the interaction between multiple components, services, and state (Signals). They verify that different "islands" of logic work together correctly without the overhead of a full browser environment.

## 🛠️ Stack
- **Framework**: [Jasmine/Karma](https://jasmine.github.io/) (via Angular CLI)
- **Library**: [Angular Testing Library (ATL)](https://testing-library.com/docs/angular-testing-library/intro/)
- **Environment**: Browser (ChromeHeadless)
- **Mocking**: `jasmine.createSpyObj()` or `jasmine.createSpy()`

## 📂 Location
All integration tests **MUST** be located in:
`src/tests-integration/[feature].integration.test.ts`

## 📏 Core Principles
1. **State Integration**: Test components together with their real Services or Signals. Avoid mocking the business logic layer unless necessary for boundary isolation.
2. **Service Interaction**: Verify that components correctly trigger service calls (e.g., `PlanService` or `AuthService`). Mock the service layer only to simulate API responses (e.g., using `jasmine.createSpyObj`).
3. **DOM Manipulation**: Verify that components correctly bind events and manipulate elements based on state changes (e.g., showing a modal after a button click).
4. **No Real Backend**: Use mocks or mock services to simulate API responses. Integration tests should be fast and deterministic.
5. **Foundational Flows**: Focus on critical paths:
    - Adding or removing items from a list and seeing the UI update.
    - Complex form calculations and feedback (e.g., total enrollment weight).
    - Session-related logic and redirection handling within components.

## 🧪 Example (Angular + Service)
```typescript
import { render, screen } from '@testing-library/angular';
import { PlanDetailComponent } from './plan-detail.component';
import { PlanService } from '@core/services/plan.service';
import { of } from 'rxjs';

it('should load details from the service and reflect them in the view', async () => {
    // 1. Mock service
    const mockPlanService = jasmine.createSpyObj('PlanService', ['getPlan']);
    mockPlanService.getPlan.and.returnValue(of({ name: 'Plan 2024', status: 'Active' }));

    // 2. Render component with necessary providers
    await render(PlanDetailComponent, {
        providers: [
            { provide: PlanService, useValue: mockPlanService }
        ],
    });

    // 3. Verify UI update
    expect(screen.getByText('Plan 2024')).toBeDefined();
    expect(screen.getByText('Active')).toBeDefined();
});
```

## 🚀 Execution
Run only integration tests:
```bash
pnpm test:integration
```

To run all tests (Unit + Integration):
```bash
pnpm test
```
