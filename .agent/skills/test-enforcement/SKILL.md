---
name: test-enforcement
description: Mandatory rule requiring a corresponding test file for every business logic file and UI component.
---

# Test Enforcement (Sysacad-Next)

## Context
To maintain 100% reliability and prevent regressions in the Sysacad-Next Frontend, it is OBLIGATORY that every file containing business logic, services, or UI components has a corresponding test file.

## Guidelines
1. **Rule of One**: Every `.ts` file in `src/app/core/services`, `src/app/core/utils`, or `src/app/features` MUST have a matching `.spec.ts` file.
2. **Location**: Test files must be located in the same directory as the file they are testing.
3. **Naming**: If the file is `auth.service.ts`, the test file MUST be `auth.service.spec.ts`.
4. **Content**:
    - **Logic/Services**: Tests must cover main success paths and edge cases.
    - **Components**: Tests must cover rendering, template binding, and interaction (using Jasmine).
5. **Simultaneous Creation/Modification**: If a testable file is created, its corresponding test file MUST be created simultaneously in the same step.

## Examples

### Correct Structure
```
src/app/core/services/
├── auth.service.ts
└── auth.service.spec.ts
```

### Incorrect Structure (Missing Test)
```
src/app/core/services/
└── auth.service.ts
(Error: Missing auth.service.spec.ts)
```
