---
name: "SSR Sanity Check"
description: "Check classic Angular SSR safety, hydration stability, and server/runtime compatibility in changed code."
argument-hint: "Provide affected routes/files"
agent: "agent"
---

Perform a classic SSR sanity check for the provided scope.

Validate:

1. No unguarded browser globals in server paths.
2. Deterministic initial rendering.
3. No obvious hydration mismatch risks.
4. Request-scoped state isolation.
5. `src/server.ts` behavior remains stable.

Return findings first, then recommended fixes and verification steps.