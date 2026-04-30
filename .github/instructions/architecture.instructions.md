---
description: "Use when implementing features under src/app/features to preserve modular architecture boundaries."
applyTo:
  - "src/app/features/**"
  - "src/app/shared/**"
  - "src/app/infrastructure/**"
---

# Architecture Instructions

Follow feature-first modular architecture. Each feature lives in `src/app/modules/<feature>/`.

## Module Structure

```
modules/<feature>/
├── components/<component-name>/   ← one directory per component
│   ├── <name>.component.ts
│   └── <name>.component.html
├── services/                      ← API calls and business logic
├── stores/                        ← signal-based local state
├── constants/                     ← enums, static values
├── models/                        ← module-scoped interfaces/types
├── data/                          ← mock/seed/fixture data
└── <feature>.routes.ts            ← lazy-loaded route declarations
```

## Module Boundary Rules (Strict)

- Modules import only from `shared/` and `infrastructure/` — never from another module.
- If two modules share logic, extract it to `shared/`.
- Routes are lazy-loaded via `<feature>.routes.ts`; `app.routes.ts` only composes them.

## Naming Conventions

- All directories and filenames use **kebab-case**.
- Every component has its own directory, even if it contains one file.

## Layer Responsibilities

- `components/`: user interaction and display only; no business logic.
- `services/`: business logic, API calls, orchestration.
- `stores/`: signal-based reactive state local to the module.
- `shared/`: cross-module primitives — no feature-specific logic allowed.
- `infrastructure/`: HTTP contract types and global theme/design tokens.

## Additional Rules

- Business logic is forbidden in templates and components.
- Keep utilities pure and side-effect free.
- Keep shared components generic; they must not import from any module.
