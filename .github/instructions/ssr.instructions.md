---
description: "Use when editing server rendering, hydration-sensitive UI, routes, guards, or data loading that can run on the server."
applyTo:
  - "src/server.ts"
  - "src/main.server.ts"
  - "src/app/**/*.ts"
  - "angular.json"
---

# Classic SSR Instructions

This project runs classic request-time SSR with Angular + Express.

## Mandatory SSR Rules

- Do not assume browser globals exist on the server.
- Guard browser-only code with platform checks.
- Keep initial render deterministic to avoid hydration mismatches.
- Prevent request-state leakage across users/requests.

## Server Entry Rules

- Keep `src/server.ts` stable and minimal.
- Avoid unsafe request handlers and debug-only endpoints in production paths.
- Preserve static asset serving and SSR fallback behavior.

## Validation

- Ensure no server crash for modified routes/components.
- Ensure no hydration mismatch is introduced.