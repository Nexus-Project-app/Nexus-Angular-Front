---
description: "Use when implementing features under src/app/features to preserve clean architecture boundaries."
applyTo:
  - "src/app/features/**"
---

# Architecture Instructions

Follow feature-first clean architecture boundaries:

- `domain`: entities, value objects, business invariants.
- `application`: use-cases, ports, DTO contracts.
- `infrastructure`: API clients, mappers, repository adapters.
- `presentation`: pages, components, view stores, interaction logic.

## Dependency Direction (Strict)

- `domain` must not depend on Angular or infrastructure.
- `application` depends on `domain` and abstract ports only.
- `infrastructure` implements `application` ports.
- `presentation` should call use-cases/services, not bypass architecture.

## Additional Rules

- Keep business rules in domain/application, not in UI components.
- Keep mapping and transport details in infrastructure.
- Keep shared helpers generic; avoid feature-specific business logic in shared.
- Business logic is forbidden in views/templates.