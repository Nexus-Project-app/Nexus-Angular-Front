# Architecture Rules

## Primary Architecture Style

Use modular architecture with feature-based modules inside `src/app/`:

```
src/app/
├── infrastructure/       ← low-level foundational resources
│   ├── models/           ← shared HTTP/API contracts and base types
│   └── theme/            ← global design tokens, styles config
│
├── modules/              ← one directory per feature
│   └── <feature>/
│       ├── components/
│       │   └── <component-name>/
│       │       ├── <component-name>.component.ts
│       │       └── <component-name>.component.html
│       ├── services/     ← API calls and business logic for this module
│       ├── stores/       ← signal-based state local to this module
│       ├── constants/    ← enums, static values, string keys
│       ├── models/       ← module-scoped interfaces and types
│       ├── data/         ← mock/seed data for testing or dev fixtures
│       └── <feature>.routes.ts   ← lazy-loaded route declarations
│
└── shared/               ← cross-module primitives only
    ├── components/       ← reusable UI components (each in own directory)
    ├── services/         ← common services (auth, http wrappers, etc.)
    ├── utils/            ← pure helper functions
    ├── stores/           ← app-wide signal stores
    ├── constants/        ← app-level constants and route tokens
    ├── models/           ← shared interfaces and types
    └── data/             ← shared mock/seed data
```

## Naming Conventions (Mandatory)

- Use **kebab-case** for all directories and filenames.
- Every component lives in its own named directory, even if it contains one file.
- Angular files follow standard suffixes: `.component.ts`, `.service.ts`, `.store.ts`, `.routes.ts`, `.constants.ts`, `.models.ts`.

## Module Boundary Rules (Strict)

- Modules access only `shared/` and `infrastructure/` — never reach into another module.
- No cross-module imports. If two modules need the same logic, move it to `shared/`.
- Route declarations stay inside the module's `<feature>.routes.ts`.
- Lazy-load every module at the route level.

## Component Rules

- Components handle user interaction and display only.
- Business logic belongs in `services/`, not in components or templates.
- Stores hold local reactive state; services perform side effects and API calls.

## Shared Layer Rules

- `shared/` contains cross-module primitives only — no feature-specific logic.
- Keep utilities pure and side-effect free.
- Keep shared components generic and reusable without feature knowledge.

## Infrastructure Rules

- `infrastructure/models/` defines HTTP response shapes and base contracts.
- `infrastructure/theme/` holds global design tokens and style configuration.
- These are foundational; modules may reference `infrastructure/models/` for API types.

## Routing Rules

- Each module declares its own routes in `<feature>.routes.ts`.
- `app.routes.ts` composes module routes via lazy loading only.
- Keep route guards thin; delegate authorization logic to services.

## SSR Architecture Rules

- Keep browser-dependent logic isolated from server execution paths.
- Keep request-specific data scoped per request; no global mutable singletons.
- Keep server-side rendering deterministic and idempotent.

## PostgreSQL Contract Rules (Frontend Perspective)

- Keep IDs, pagination, filtering, and sorting explicit and typed.
- Restrict filter operators to whitelisted values.
- Do not send free-form query fragments.
- Preserve server contract assumptions that protect PostgreSQL safety.
