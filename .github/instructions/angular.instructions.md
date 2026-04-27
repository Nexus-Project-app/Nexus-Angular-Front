---
description: "Use when creating or editing Angular components, templates, services, routes, or forms."
applyTo:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
  - "src/app/**/*.css"
---

# Angular Instructions (v21+)

## Component And Template Rules

- Use standalone-first Angular defaults.
- Use `ChangeDetectionStrategy.OnPush` by default for components.
- Use `input()` and `output()` functions for new component APIs.
- Use `computed()` for derived values.
- Prefer Angular built-in control flow (`@if`, `@for`, `@switch`).
- Keep templates simple; move complex logic into TypeScript.
- Do not place business logic in components or templates.

## State And Reactivity

- Use signals for local UI state.
- Use `set()` and `update()`, not `mutate()`.
- Keep state transitions deterministic and explicit.

## Dependency Injection

- Prefer `inject()` in new code.
- Keep service responsibilities narrow and cohesive.

## HTTP Client Rules

- `axios` package is forbidden in this repository.
- Use Angular `HttpClient` with typed request and response models.

## Forms And Accessibility

- Prefer reactive forms.
- Keep form models strongly typed.
- Ensure accessible names, keyboard support, and clear error messages.

## SSR Safety

- Guard browser-only APIs (`window`, `document`, storage APIs).
- Avoid non-deterministic initial markup between server and client.