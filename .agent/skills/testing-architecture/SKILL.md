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
    - **Integration**: `src/tests-integration/`. Interaction tests between multiple components or logic modules (using Karma + Jasmine).
    - **E2E**: `tests/e2e/`. Real browser end-to-end flows covering complete user journeys.

## 🧱 Test Tiers

| Tier | Scope | Framework | Execution Context | Location |
| :--- | :--- | :--- | :--- | :--- |
| **Unit** | Atomic logic | Jasmine + Karma | Browser (ChromeHeadless) | Adjacent |
| **Integration** | Component/Service interactions | Jasmine + Karma | Browser (ChromeHeadless) | `src/tests-integration/` |
| **E2E** | User-facing flows | Cypress | Browser (Real) | `src/tests-e2e/` |

## 📏 Core Principles
- **Speed first**: Unit and Integration tests must be extremely fast. Use `ChromeHeadless` for browser environment.
- **No Overlap**: If a logic branch is covered by a Unit test, do not duplicate it in Integration. Use Integration to test the "glue" between units.
- **Real-world E2E**: E2E tests are organized by role and reserved for critical user journeys.
- **Proximity**: Keep unit tests close to the code to encourage TDD.
- **Centralized Testing**: All test suites (Integration and E2E) live in `src/` to maintain a unified code + quality structure.
- **Type Forcing**: Integration tests must include `/// <reference types="jasmine" />` to resolve Vitest conflicts in the IDE.
