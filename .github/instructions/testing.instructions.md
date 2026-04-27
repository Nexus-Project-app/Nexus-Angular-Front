---
description: "Use when writing or modifying tests, or when code behavior changes require test updates."
applyTo:
  - "**/*.spec.ts"
---

# Testing Instructions

## Testing Goals

- Prevent regressions in business behavior.
- Cover critical and edge-case flows.
- Protect SSR rendering and hydration behavior.

## Test Design Rules

- Test behavior and contracts, not implementation details.
- Keep tests deterministic and isolated.
- Mock infrastructure boundaries where appropriate.
- Add regression tests for fixed bugs.

## Must-Cover Areas

1. Changed domain/application logic.
2. Error and validation paths.
3. Security-sensitive flows.
4. SSR-sensitive rendering logic.

## Validation

- Run `npm run test` when behavior changes.
- Keep test names explicit and scenario-based.