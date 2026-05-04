
# Nexus Angular Front - AI Operating Manual

This repository is Angular 21 with classic SSR (request-time server rendering) using
`@angular/ssr` and Express.

Backend data is PostgreSQL behind APIs. Frontend never writes SQL, but all contracts,
filters, identifiers, and validation rules must remain PostgreSQL-safe and injection-safe.

## Non-Negotiable Priorities

1. Security first.
2. SSR correctness second.
3. Functional correctness third.
4. Performance and DX fourth.

If constraints conflict, never sacrifice security or SSR integrity for speed.

## Mandatory Rule Files

Always load and apply these files before coding:

1. `.claude/rules/core.md`
2. `.claude/rules/angular.md`
3. `.claude/rules/architecture.md`
4. `.claude/rules/testing.md`
5. `.claude/rules/security.md`
6. `.claude/rules/ssr.md`
7. `.claude/rules/sonarlint.md`
8. `.claude/rules/git-workflow.md`

## Available Skills

- `.claude/skills/design/SKILL.md` — design system, tokens, component patterns
- `.claude/skills/implement-feature/SKILL.md`
- `.claude/skills/review-pr/SKILL.md`
- `.claude/skills/angular-ssr/SKILL.md`
- `.claude/skills/security-hardening/SKILL.md`
- `.claude/skills/sonarlint-remediation/SKILL.md`
- `.claude/skills/snyk-dependency-audit/SKILL.md`

## Available Agents

- `.claude/agents/code-reviewer.md`
- `.claude/agents/sonarlint-guardian.md`
- `.claude/agents/snyk-security-agent.md`

## Project Context Summary

- Framework: Angular 21+.
- Rendering model: classic SSR, not SSG and not CSR-only.
- Runtime server: Express Node handler in `src/server.ts`.
- Build mode: `outputMode: "server"`.
- Quality baseline: SonarLint clean on modified code.
- Security baseline: zero known high vulnerabilities from dependency and code scans.

## Definition of Done

A change is done only when all are true:

1. Architecture boundaries are respected.
2. SSR behavior is correct and stable (no browser-global crashes on server).
3. Tests are updated and relevant.
4. SonarLint issues introduced by the change are fixed.
5. Security checks and threat vectors are reviewed.

## Local Overrides

Local machine-specific overrides may be placed in `CLAUDE.local.md` at repository root.
Do not put secrets in any `.claude` file.
