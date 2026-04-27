# .claude Folder Guide

This folder centralizes AI behavior, coding standards, and specialized workflows for
this Angular 21 SSR project.

## Structure

- `CLAUDE.md`: main operating manual loaded first.
- `settings.json`: local permissions and safety defaults.
- `rules/`: always-on engineering rules.
- `skills/`: reusable multi-step workflows.
- `agents/`: specialized personas (review, SonarLint, Snyk).

## Current Focus

- Angular 21 modern patterns (signals, control flow, standalone defaults).
- Classic SSR only (request-time rendering), not SSG and not CSR-only.
- Security-by-default engineering.
- SonarLint quality gates.
- Dependency and code vulnerability checks with Snyk.

## How To Use

1. Keep `CLAUDE.md` short and orchestration-focused.
2. Put detailed constraints in `rules/` files.
3. Use `skills/` for repeatable implementation/review playbooks.
4. Use `agents/` for focused analyses:
   - `code-reviewer` for PR risk reviews.
   - `sonarlint-guardian` for static quality/safety issues.
   - `snyk-security-agent` for dependency and code vulnerability audits.

## Maintenance Rules

- Update rule files when project conventions change.
- Keep skills procedural and actionable.
- Keep agent scopes narrow; avoid all-in-one agents.
- Never store secrets or credentials in this folder.