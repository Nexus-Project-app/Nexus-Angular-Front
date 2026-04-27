# Classic SSR Rules

## Rendering Model (Mandatory)

This project uses classic request-time SSR with Angular + Express.

- It is not SSG.
- It is not CSR-only.
- Every request may execute server rendering logic.

## Server Runtime Constraints

- Code executed during SSR must run in Node.js safely.
- Never assume browser globals exist on the server.
- Guard browser-only logic with platform checks.
- Keep SSR output deterministic for hydration stability.

## Data Fetching And State

- Keep request-scoped data isolated per request.
- Do not leak state across users/requests through mutable singletons.
- Prefer explicit data-loading flows suitable for SSR and hydration.
- Keep serialization/hydration payloads minimal.

## Routing And Navigation

- Ensure routes are SSR-compatible.
- Avoid route-side effects that depend on browser-only APIs during SSR.
- Keep guard and resolver logic safe for server execution.

## Hydration Safety

- Avoid non-deterministic values in initial render (timestamps/random) unless synchronized.
- Ensure server and client markup match for hydrated views.
- Defer browser-only enhancements until after hydration when needed.

## Express SSR Server Rules

- Keep `src/server.ts` stable and minimal.
- Do not add unsafe request handlers or debug endpoints in production paths.
- Validate all user-controlled request data before using it.
- Preserve static asset and SSR fallback routing behavior.

## Performance And Caching

- Use safe caching strategies that do not leak user-specific content.
- Keep server render paths efficient and side-effect free.
- Avoid expensive synchronous work in request paths.

## SSR Definition Of Done

1. No server-side crash for updated routes/components.
2. No hydration mismatch introduced.
3. Browser-only APIs are correctly guarded.
4. Request isolation is preserved.