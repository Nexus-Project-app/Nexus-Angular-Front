---
name: "Review PR Risks"
description: "Review changed files for security, SSR regressions, architecture violations, and missing tests."
argument-hint: "Provide changed files, diff summary, or PR scope"
agent: "agent"
---

Review the provided scope and report findings first, ordered by severity.

Focus on:

1. Security vulnerabilities.
2. SSR/hydration regressions.
3. Functional correctness bugs.
4. Architecture boundary violations.
5. Missing high-risk test coverage.

For each finding, include:

- Evidence location.
- Why it matters.
- Recommended fix.

If no blocking findings exist, state that explicitly and list residual risks.