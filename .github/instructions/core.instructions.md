---
description: "Use when implementing or refactoring code in this repository. Defines core priorities, safe coding defaults, and quality gates."
applyTo:
  - "src/**/*.ts"
  - "src/**/*.html"
  - "src/**/*.css"
---

# Core Engineering Instructions

## Priority Order

1. Security
2. SSR correctness
3. Functional correctness
4. Performance
5. Developer experience

## Required Workflow

1. Identify the behavior change and affected architecture layer.
2. Make the smallest safe change that solves the requirement.
3. Keep public APIs stable unless a breaking change is explicitly requested.
4. Add or update tests for changed behavior and edge cases.
5. Validate quality and security before completion.

## Coding Standards

- Use strict typing everywhere in application code.
- `any` and `unknown` types are forbidden in application code.
- Type function parameters, returns, DTOs, and state models explicitly.
- Prefer pure functions and immutable state updates.
- Avoid hidden side effects and dead code.
- Keep changes focused; do not refactor unrelated parts.

## Error Handling

- Fail safely and predictably.
- Return actionable errors for UI layers.
- Never expose secrets or internals in user-visible errors.

## Quality Gates

- Run `npm run build` for meaningful code changes.
- Run `npm run test` for behavior changes.
- Keep modified files free of new SonarLint blocker/critical issues.

## Security Baseline

- Treat all external input as untrusted.
- Never hardcode secrets or credentials.
- Avoid dynamic execution patterns.