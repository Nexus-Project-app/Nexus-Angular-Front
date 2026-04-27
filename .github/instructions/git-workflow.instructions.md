---
description: "Use when creating branches, writing commits, pushing code, or preparing pull requests. Enforces no direct push to main and Feature/<nom-feature> workflow."
---

# Git Commit And PR Workflow Instructions

## Branch Rules

- Do not commit or push directly to `main`.
- Always work in a branch named:
  - `Feature/<nom-feature>`
- Branch must be created from latest `main`.

## Commit Rules

- Keep commits small, atomic, and reviewable.
- Avoid vague messages (`wip`, `tmp`, `fix` alone).
- Prefer Conventional Commits format:
  - `feat(scope): summary`
  - `fix(scope): summary`
  - `refactor(scope): summary`
  - `test(scope): summary`
  - `chore(scope): summary`

## Push Rules

- Push only feature branches.
- Never force-push `main`.
- If needed on your own branch, use `--force-with-lease` only.

## Pull Request Rules

- Source: `Feature/<nom-feature>`.
- Target: `main`.
- PR must include:
  1. Context/problem
  2. Implemented solution
  3. SSR impact assessment
  4. Security impact assessment
  5. Test evidence

For UI changes, include screenshots.

## Required Checks Before Merge

- `npm run build` passes.
- `npm run test` passes.
- SonarLint issues in changed files are resolved.
- Snyk check done for dependency updates.
- At least one reviewer approval.

## Merge Policy

- Prefer squash merge.
- Delete merged feature branches.
- Direct main changes require explicit emergency approval only.