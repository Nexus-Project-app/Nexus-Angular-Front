# Nexus Design System Skill

## Use This Skill When

- Building any UI component for Nexus.
- Applying or modifying colors, typography, spacing, or layout.
- Implementing dark/light mode toggling.
- Reviewing component styling for consistency.

---

## Design Tokens

Tokens live in `src/app/infrastructure/theme/tokens.css`.
They are imported in `src/styles.css` and exposed to Tailwind via `@theme inline`.

### Color Palette

| Token (CSS var)          | Light          | Dark      | Tailwind class          |
|--------------------------|----------------|-----------|-------------------------|
| `--nexus-bg`             | `#F6F6F6`      | `#0A0A0F` | `bg-nexus-bg`           |
| `--nexus-bg-component`   | `#FFFFFF`      | `#14141F` | `bg-nexus-component`    |
| `--nexus-text-primary`   | `#0A0A0F`      | `#FFFFFF` | `text-nexus-primary`    |
| `--nexus-text-secondary` | `#9CA3AF`      | `#9CA3AF` | `text-nexus-secondary`  |
| `--nexus-interaction`    | `#5B7CFF`      | `#5B7CFF` | `bg-nexus-interaction`  |
| `--nexus-border`         | `#E5E7EB`      | `#1F1F2E` | `border-nexus-border`   |

### Typography

- Font family: system-ui / Inter (inherit from Tailwind defaults).
- Primary text: `text-nexus-primary text-sm` or `text-base`.
- Secondary / meta text: `text-nexus-secondary text-xs`.
- Headings: `font-semibold text-nexus-primary`.

---

## Layout Anatomy (from mockup)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR  (sticky, bg-nexus-component border-b)              │
│  [Logo] [Search btn]         [Theme toggle] [Avatar + name] │
├──────────────┬──────────────────────┬────────────────────────┤
│ LEFT SIDEBAR │    MAIN FEED         │   RIGHT SIDEBAR        │
│ w-56         │    flex-1 max-w-2xl  │   w-72                 │
│              │                      │                        │
│ Group/channel│  Post card           │  Trending topics widget│
│ list items   │  Post card           │  Trending groups widget│
│              │  ...                 │                        │
│ [FAB]        │                      │  Footer links          │
└──────────────┴──────────────────────┴────────────────────────┘
```

---

## Component Patterns

### Navbar
```html
<nav class="sticky top-0 z-40 bg-nexus-component border-b border-nexus-border
            flex items-center justify-between px-6 h-14">
  <!-- Logo SVG (src/assets/nexus-logo.svg) -->
  <!-- Search button: text-nexus-secondary hover:text-nexus-primary -->
  <!-- Theme toggle: icon button -->
  <!-- Avatar + name: flex items-center gap-2 -->
</nav>
```

### Post Card
```html
<article class="bg-nexus-component border border-nexus-border rounded-xl p-5 space-y-3">
  <!-- Author row: avatar (w-8 h-8 rounded-full) + username + @handle + time -->
  <header class="flex items-center gap-3">...</header>
  <!-- Title: text-nexus-primary font-semibold text-base -->
  <h2 class="font-semibold text-nexus-primary">...</h2>
  <!-- Excerpt: text-nexus-secondary text-sm line-clamp-2 -->
  <p class="text-nexus-secondary text-sm line-clamp-2">...</p>
  <!-- Tags: inline badges bg-nexus-border rounded-full px-2 py-0.5 text-xs -->
  <div class="flex gap-2">...</div>
  <!-- Interaction bar: likes · comments · reposts · saves -->
  <footer class="flex items-center justify-between text-nexus-secondary text-sm">...</footer>
</article>
```

### Sidebar Widget (Trending)
```html
<aside class="bg-nexus-component border border-nexus-border rounded-xl p-4 space-y-3">
  <h3 class="flex items-center gap-2 font-semibold text-nexus-primary text-sm">
    <span>📈</span> Découverte de Sujets
  </h3>
  <ul class="space-y-2">
    <li class="flex justify-between text-sm">
      <span class="text-nexus-primary font-medium">Kubernetes</span>
      <span class="text-nexus-secondary">8465 posts</span>
    </li>
    ...
  </ul>
</aside>
```

### Left Sidebar — Group/Channel Item
```html
<li class="flex items-center gap-3 px-3 py-2 rounded-lg
           hover:bg-nexus-bg cursor-pointer transition-colors">
  <span class="w-8 h-8 rounded-full bg-nexus-bg flex-shrink-0"></span>
  <span class="text-nexus-primary text-sm truncate">Lorum ispeum</span>
</li>
```

### Search Modal (Spotlight)
```html
<div class="fixed inset-0 z-50 flex items-start justify-center pt-20
            bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
  <div class="bg-nexus-component border border-nexus-border rounded-xl
              w-full max-w-2xl shadow-2xl">
    <!-- Input row with search icon -->
    <!-- Results list (empty state = search prompt) -->
    <!-- Footer: keyboard shortcut legend -->
    <!-- ↓↑ Choisir · ↵ Ouvrir · ESC Fermer · # Tags · @ Utilisateur -->
  </div>
</div>
```

### FAB (Floating Action Button)
```html
<button class="fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2.5
               bg-nexus-interaction hover:bg-nexus-interaction-hover
               text-white text-sm font-medium rounded-full shadow-lg
               transition-colors">
  <span>Rejoindre un groupe</span>
  <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">+</span>
</button>
```

### Footer Links (inside right sidebar, bottom)
```html
<footer class="text-xs text-nexus-secondary flex flex-wrap gap-x-3 gap-y-1 pt-3">
  <a href="/conditions" class="hover:text-nexus-primary transition-colors">Conditions d'utilisation</a>
  <a href="/policy" class="hover:text-nexus-primary transition-colors">Politique de Confidentialité</a>
  <a href="/about" class="hover:text-nexus-primary transition-colors">À propos</a>
  <a href="/cookies" class="hover:text-nexus-primary transition-colors">Cookies</a>
  <span>Nexus © 2026</span>
</footer>
```

---

## Dark / Light Mode

Toggle is managed by adding/removing the `.dark` class on `<html>`.
Implement a `ThemeService` in `shared/services/` that:

1. Reads initial preference from `localStorage` (key: `nexus-theme`), falling back to `prefers-color-scheme`.
2. Applies `.dark` class to `document.documentElement`.
3. Exposes a `theme` signal (`'light' | 'dark'`) for components.
4. Guards `localStorage` / `document` access behind `isPlatformBrowser` for SSR safety.

```typescript
// shared/services/theme.service.ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly theme = signal<'light' | 'dark'>('light');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('nexus-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.apply((saved as 'light' | 'dark') ?? preferred);
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(t: 'light' | 'dark'): void {
    this.theme.set(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    if (isPlatformBrowser(this.platformId)) localStorage.setItem('nexus-theme', t);
  }
}
```

Call `themeService.init()` inside `APP_INITIALIZER` or in `AppComponent.ngOnInit()` guarded by `isPlatformBrowser`.

---

## Assets

- Logo SVG → `public/nexus-logo.svg` (use `<img>` or inline SVG component)
- Logo reference: the diamond-shaped geometric icon + "NEXUS" wordmark
- Gradient on logo icon: linear `#B374FF` → `#006FFF`

---

## Rules

- Always use token-based Tailwind classes (`bg-nexus-component`, NOT `bg-[#14141F]`).
- Never hardcode hex colors in templates or component styles.
- Every new component must work in both dark and light mode.
- Keep the three-column layout responsive: collapse right sidebar at `lg`, left sidebar at `md`.
- Interactive elements use `nexus-interaction` color for primary actions only.
- Secondary actions: `text-nexus-secondary hover:text-nexus-primary`.
- Borders use `border-nexus-border`; subtle separators use `border-nexus-border-subtle`.
