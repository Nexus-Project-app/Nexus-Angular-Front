---
name: snyk-dependency-audit
description: "Use when auditing dependencies with Snyk, triaging CVEs, planning secure upgrades, and validating Angular SSR compatibility after upgrades."
argument-hint: "Describe dependency change scope or requested audit depth"
user-invocable: true
---

# Snyk Dependency Audit Workflow

## Use This Skill When

- Upgrading dependencies.
- Preparing releases.
- Responding to reported CVEs.
- Running scheduled security hygiene checks.

## Audit Process

1. Run `npx snyk test`.
2. If available, run `npx snyk code test`.
3. Collect findings by severity and exploit path.
4. Map findings to direct/transitive dependencies.

## Prioritization

- Critical/high exploitable issues first.
- Runtime dependencies before dev-only dependencies.
- Externally exposed code paths before internal-only paths.

## Remediation Strategy

- Prefer patched versions and low-risk upgrades.
- For transitive issues, evaluate override/resolution strategy.
- For major upgrades, provide compatibility notes and rollback plan.
- If unresolved, define compensating controls and tracking item.

## Angular SSR Compatibility Checks

After updates, verify:

- `npm run build` succeeds.
- `npm run test` succeeds.
- SSR server entry and render flow still run.
- No hydration/runtime regressions in critical pages.

## Deliverable

1. Findings summary.
2. Upgrade plan with versions.
3. Risk/impact assessment.
4. Verification results and residual risks.