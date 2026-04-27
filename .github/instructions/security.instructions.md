---
description: "Use when handling user input, auth/session state, API payloads, or any security-sensitive frontend behavior."
applyTo:
  - "src/**/*.ts"
---

# Security Instructions

## Baseline

Treat all input as untrusted and preserve least-privilege behavior.

## Mandatory Rules

- Validate and normalize route/query/form/input payloads.
- Avoid unsafe HTML insertion or sanitizer bypass.
- Never expose secrets, tokens, or internals in logs/errors.
- Keep auth and permission UX explicit and fail-safe.
- `axios` package is forbidden; use Angular `HttpClient` and interceptors.

## PostgreSQL-Aware API Contract Rules

Frontend does not write SQL, but must preserve backend safety assumptions:

- Keep filters typed and allowlisted.
- Keep sort fields constrained to known values.
- Keep pagination numeric and bounded.
- Never send raw query fragments.

## Dependency Hygiene

- Run `npx snyk test` for dependency updates.
- Use `npx snyk code test` when available.