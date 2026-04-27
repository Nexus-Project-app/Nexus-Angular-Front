---
description: "Use when triaging SonarLint issues and enforcing quality gates on modified files."
applyTo:
  - "src/**/*.ts"
---

# SonarLint Instructions

## Triage Order

1. Blocker/Critical issues first.
2. Major issues second.
3. Minor issues when low cost or repeated patterns.

## Rules

- Fix root causes instead of suppressing warnings.
- Avoid introducing complexity while fixing issues.
- Re-run analysis on modified files after changes.
- Add tests for bug-prone/security-prone fixes.

## Completion Criteria

- No new blocker/critical issues in changed files.
- Major issues fixed or explicitly justified.