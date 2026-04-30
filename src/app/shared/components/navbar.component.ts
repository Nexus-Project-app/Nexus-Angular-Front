import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ThemeService } from '../services/theme.service';

export interface UserProfile {
  readonly name: string;
  readonly role: string;
}

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <header class="top-header" aria-label="Barre supérieure">
      <a class="brand" href="#" aria-label="Accueil Nexus" (click)="navigateHome($event)">
        <img ngSrc="/nexus.svg" alt="Nexus" width="360" height="80" priority />
      </a>
      <div class="header-actions" aria-label="Actions utilisateur">
        <button class="icon-button" type="button" aria-label="Rechercher">
          <i class="fas fa-search"></i>
        </button>
        <button
          class="icon-button"
          type="button"
          [attr.aria-label]="themeService.isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'"
          (click)="themeService.toggle()"
        >
          <i [class]="themeService.isDark() ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
        <div class="user-meta">
          <div class="avatar" aria-hidden="true">{{ userInitial() }}</div>
          <div>
            <p class="user-name">{{ user().name }}</p>
            <p class="user-role">{{ user().role }}</p>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: `
    .top-header {
      align-items: center;
      background: var(--nexus-bg-component);
      border-bottom: 1px solid var(--nexus-border);
      border-radius: 0;
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 1rem;
    }

    .brand {
      align-items: center;
      display: inline-flex;
      height: 3rem;
      cursor: pointer;
      text-decoration: none;
    }

    .brand img {
      display: block;
      height: 100%;
      width: auto;
    }

    .header-actions {
      align-items: center;
      display: flex;
      gap: 0.75rem;
    }

    .icon-button {
      align-items: center;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--nexus-text-primary);
      cursor: pointer;
      display: inline-flex;
      height: 2rem;
      justify-content: center;
      width: 2rem;
      transition: all 0.2s ease;
    }

    .icon-button i {
      font-size: 1rem;
      color: inherit;
    }

    .icon-button:hover {
      filter: brightness(1.08);
    }

    .icon-button:focus-visible {
      border-color: #b374ff;
      outline: 2px solid #b374ff;
      outline-offset: 2px;
    }

    .user-meta {
      align-items: center;
      display: flex;
      gap: 0.625rem;
    }

    .avatar {
      align-items: center;
      background: var(--nexus-text-secondary);
      border-radius: 999px;
      color: #0a0a0f;
      display: inline-flex;
      font-weight: 700;
      height: 2rem;
      justify-content: center;
      width: 2rem;
    }

    .user-name {
      color: var(--nexus-text-primary);
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.2;
      margin: 0;
    }

    .user-role {
      color: color-mix(in srgb, var(--nexus-text-secondary) 70%, transparent);
      font-size: 0.8rem;
      line-height: 1.2;
      margin: 0;
    }
  `
})
export class NavbarComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly user = signal<UserProfile>({
    name: 'Admin Superadmin',
    role: 'Administrateur',
  });

  protected readonly userInitial = computed(() =>
    this.user().name.trim().charAt(0).toUpperCase()
  );

  navigateHome(event: Event): void {
    event.preventDefault();
    globalThis.location.href = '/';
  }
}
