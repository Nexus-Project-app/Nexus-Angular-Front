---
name: "Fix SonarLint Findings"
description: "Triage and remediate SonarLint findings with minimal-risk fixes and no SSR/security regressions."
argument-hint: "Provide files/findings to remediate"
agent: "agent"
---

Triage and fix SonarLint issues in the provided scope.

Process:

1. Prioritize blocker/critical then major findings.
2. Group by root cause and apply smallest safe fixes.
3. Re-check modified files for remaining issues.
4. Confirm no SSR or security regressions.

Return:

- Findings fixed.
- Findings deferred (with rationale).
- Residual risks.