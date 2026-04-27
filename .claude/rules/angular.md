# Angular Rules (Angular 21+)

## Framework Mode

- Use standalone-first Angular architecture.
- Do not add `standalone: true` explicitly in decorators (default in v20+).
- Prefer feature-level lazy loading for route trees.

## Component Rules

- Keep components small and responsibility-focused.
- Default to `ChangeDetectionStrategy.OnPush`.
- Use `input()` and `output()` functions instead of decorators.
- Use `computed()` for derived values.
- Keep template logic simple; move complex logic to TypeScript.
- Do not place business logic in components or templates.
- Prefer class/style bindings over `ngClass` and `ngStyle`.

## State Rules

- Use signals for local UI state.
- Use `set()` and `update()` instead of `mutate()`.
- Keep state transitions pure and deterministic.
- Avoid shared mutable global state.

## Template Rules

- Use Angular built-in control flow (`@if`, `@for`, `@switch`).
- Use `track` in `@for` loops when possible.
- Prefer `async` pipe for Observable consumption in templates.
- Avoid side-effectful expressions in templates.

## Dependency Injection Rules

- Prefer `inject()` over constructor injection in new code.
- Keep providers scoped intentionally.
- Use `providedIn: 'root'` for app-wide singleton services.

## HTTP Client Rules

- `axios` package is forbidden in this repository.
- Use Angular `HttpClient` with typed request and response models.
- Keep cross-cutting request concerns in interceptors (auth, retry, errors).

## Forms Rules

- Prefer reactive forms.
- Keep form models strongly typed.
- Keep validation explicit and reusable.
- Never trust client-side validation as a security boundary.

## Accessibility Rules

- Meet WCAG AA minimums.
- Ensure focus order and keyboard navigation work.
- Ensure form controls have accessible names and error messaging.
- Ensure contrast and semantic structure are correct.

## Angular + SSR Rules

- Avoid browser-only globals (`window`, `document`, `localStorage`) in server paths.
- Guard browser-only code with platform checks.
- Avoid non-deterministic template output between server and browser.
- Avoid direct DOM manipulation where Angular rendering APIs are sufficient.

## Performance Rules

- Use route-level lazy loading and code splitting.
- Prevent unnecessary re-renders.
- Keep change detection cost low through pure derived state.
- Use `NgOptimizedImage` for static images when applicable.
