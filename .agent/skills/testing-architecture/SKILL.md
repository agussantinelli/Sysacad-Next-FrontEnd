---
name: testing-architecture
description: Guidelines for the overall test organization in Sysacad-Next, including unit, integration, and E2E tiers.
---

# 🏗️ Testing Architecture

Sysacad-Next follows a three-tiered testing strategy to ensure reliability, performance, and code quality. All automated tests are organized following a clear hierarchy and specific tools.

## 📁 Directory Structure

1.  **Unit Tests (Isolated Logic)**:
    - **Scope**: Individual components, services, utils, pipes, and interceptors in isolation.
    - **Tool**: Jasmine + Karma.
    - **Location**: Adjacent to the source file they test (same directory).
    - **Naming**: `[name].spec.ts`.
    - **Enforcement**: Defined in the [test-enforcement](file:///c:/Users/Agus/Documents/Sysacad-Next/Sysacad-Next-FrontEnd/.agent/skills/test-enforcement/SKILL.md) skill.

2.  **Integration & E2E (Multi-module & Flows)**:
    - **Location**: All high-level and interaction tests are centralized in the `tests/` directory at the project root.
    - **Structure**:
      - `tests/integration/`: Interaction tests between multiple components or logic modules (using Vitest + happy-dom).
      - `tests/e2e/`: Real browser end-to-end flows covering complete user journeys.

## 🧱 Test Tiers

| Tier | Scope | Framework | Execution Context | Location |
| :--- | :--- | :--- | :--- | :--- |
| **Unit** | Atomic logic | Jasmine + Karma | Browser (ChromeHeadless) | Adjacent |
| **Integration** | Component/Service interactions | Vitest + ATL | Node (happy-dom) | `tests/integration/` |
| **E2E** | User-facing flows | Cypress | Browser (Real) | `tests/e2e/` |

## 📏 Core Principles
- **Speed first**: Unit and Integration tests must be extremely fast. Use `happy-dom` for integration.
- **No Overlap**: If a logic branch is covered by a Unit test, do not duplicate it in Integration. Use Integration to test the "glue" between units.
- **Real-world E2E**: E2E tests should be reserved for the most critical paths and happy paths (e.g., successful registration, exam enrollment).
- **Proximity**: Keep unit tests close to the code to encourage TDD and maintainability.
- **Centralized Integration**: High-level tests move out of `src/` to remain clean and focused on business flows.
