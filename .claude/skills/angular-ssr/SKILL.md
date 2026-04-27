---
name: angular-ssr
description: "Use when implementing or debugging classic Angular SSR behavior, hydration mismatches, server-only crashes, or Express rendering pipeline issues."
argument-hint: "Describe SSR bug or feature and affected route"
user-invocable: true
---

# Angular Classic SSR Workflow

## Use This Skill When

- Adding SSR-sensitive pages/components.
- Investigating server-side crashes.
- Fixing hydration mismatch issues.
- Modifying `src/server.ts` or server rendering setup.

## Core Constraints

- Rendering model is classic request-time SSR.
- Not SSG, not CSR-only.
- Server render output must be hydration-compatible.

## Step-by-Step Process

1. Identify server-executed code paths.
2. Find browser-global usage and guard or isolate it.
3. Ensure deterministic initial render output.
4. Verify request-scoped state isolation.
5. Keep Express SSR handler stable and minimal.
6. Validate route and data-loading SSR compatibility.
7. Run build/test and manual SSR smoke checks.

## Detection Checklist

- Uses of `window`, `document`, `localStorage`, `sessionStorage`.
- Non-deterministic rendering (`Date.now()`, random values) in initial markup.
- Mutable singleton state that can leak between requests.
- Browser-only side effects executed before hydration.

## Remediation Patterns

- Move browser-only logic behind platform guards.
- Defer browser-only behavior to client lifecycle hooks.
- Move unstable values behind server-provided deterministic data.
- Keep request data local to request scope.

## Validation Checklist

- No SSR crash for modified routes.
- No hydration mismatch warnings for modified pages.
- No cross-request data leakage.
- Existing route behavior unchanged unless intended.