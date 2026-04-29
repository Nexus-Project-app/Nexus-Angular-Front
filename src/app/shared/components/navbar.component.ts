import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

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
        <button class="icon-button" type="button" aria-label="Changer de thème">
          <i class="fas fa-sun"></i>
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
      background: #14141f;
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
      color: #ffffff;
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
      background: #9ca3af;
      border-radius: 999px;
      color: #0a0a0f;
      display: inline-flex;
      font-weight: 700;
      height: 2rem;
      justify-content: center;
      width: 2rem;
    }

    .user-name {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.2;
      margin: 0;
    }

    .user-role {
      color: rgba(156, 163, 175, 0.7);
      font-size: 0.8rem;
      line-height: 1.2;
      margin: 0;
    }
  `
})
export class NavbarComponent {
  protected readonly user = signal<UserProfile>({
    name: 'Admin Superadmin',
    role: 'Administrateur',
  });

  protected readonly userInitial = computed(() => 
    this.user().name.trim().charAt(0).toUpperCase()
  );

  constructor() {}

  navigateHome(event: Event): void {
    event.preventDefault();
    // Navigate to home - this will be handled by router in parent components
    window.location.href = '/';
  }
}
