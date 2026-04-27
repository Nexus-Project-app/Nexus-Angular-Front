---
name: "Implement Feature (Angular SSR)"
description: "Implement a feature with clean architecture boundaries, SSR safety, security checks, and tests."
argument-hint: "Describe feature goal, route/user flow, and constraints"
agent: "agent"
---

Implement the requested feature using this repository standards:

1. Respect architecture boundaries (`domain`, `application`, `infrastructure`, `presentation`).
2. Keep Angular 21 modern patterns (signals, built-in control flow).
3. Preserve classic SSR safety and hydration stability.
4. Preserve PostgreSQL-safe API-contract constraints.
5. Add or update relevant tests.
6. Run build/test validation steps if code changed.

Return:

- Files changed and why.
- SSR/security checks performed.
- Test updates and status.