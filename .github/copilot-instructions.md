# Nexus Angular Front - Copilot Instructions

This repository uses Angular 21 with classic request-time SSR via `@angular/ssr`
and Express.

## Non-Negotiable Priorities

1. Security first.
2. SSR correctness second.
3. Functional correctness third.
4. Performance and DX fourth.

If constraints conflict, keep this order.

## Project Context

- Rendering mode is classic SSR (not SSG, not CSR-only).
- Runtime server entrypoint is `src/server.ts`.
- Build mode uses `outputMode: "server"` in `angular.json`.
- Backend data is PostgreSQL behind APIs.
- Frontend must preserve PostgreSQL-safe contracts (typed filters, bounded
  pagination, allowlisted sorts, no raw query fragments).

## Mandatory Conventions

- Use modern Angular 21 patterns (signals, built-in control flow, standalone
  defaults).
- `axios` is forbidden; use Angular `HttpClient` only.
- `any` and `unknown` types are forbidden in application code.
- Business logic is forbidden in views/templates and must live in
  domain/application layers.
- Keep architecture boundaries in `domain`, `application`, `infrastructure`, and
  `presentation` layers.
- Keep modified code SonarLint-clean.
- Run Snyk audits for dependency-risking changes.

## Build And Validation Commands

- `npm run build`
- `npm run test`
- `npx snyk test` (when dependencies are added/updated)
- `npx snyk code test` (when available and relevant)

## Where Detailed Rules Live

Use the focused instruction files in `.github/instructions/`:

- `core.instructions.md`
- `angular.instructions.md`
- `architecture.instructions.md`
- `testing.instructions.md`
- `security.instructions.md`
- `ssr.instructions.md`
- `sonarlint.instructions.md`
- `git-workflow.instructions.md`

Do not store secrets in repository instruction files.