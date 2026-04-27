---
name: "Snyk Audit And Fix Plan"
description: "Audit dependencies/code with Snyk and produce a safe remediation plan compatible with Angular SSR."
argument-hint: "Provide audit scope (full repo or specific dependency changes)"
agent: "agent"
---

Run a Snyk-oriented security audit workflow:

1. Dependency findings (`npx snyk test`) if available.
2. Code findings (`npx snyk code test`) if available.
3. Prioritize by severity and exploitability.
4. Propose low-risk upgrades and mitigations.
5. Verify compatibility with Angular 21 and classic SSR.

Return:

- Findings summary.
- Recommended fix plan.
- Compatibility and rollback notes.