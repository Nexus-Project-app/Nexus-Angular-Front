import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { environment } from '../../../environment/environment';
import { AuthService } from '../services/auth.service';

export interface UserProfile {
  readonly name: string;
  readonly email: string;
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
          [attr.aria-label]="
            themeService.isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'
          "
          (click)="themeService.toggle()"
        >
          <i [class]="themeService.isDark() ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
        @if (isConnected) {
          <div class="user-meta">
            <div class="avatar" aria-hidden="true">{{ userInitial() }}</div>
            <div>
              <p class="user-name" class="flex">{{ user().name }} - {{ user().role }}</p>
              <p class="user-role">{{ user().email }}</p>
            </div>
          </div>
          <button class="icon-button" type="button" aria-label="Se déconnecter" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        }

        @if (!isConnected) {
          <button class="icon-button" type="button" aria-label="Se connecter" (click)="login()">
            <i class="fas fa-user"></i>
          </button>
        }
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
  `,
})
export class NavbarComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly auth = inject(AuthService);

  protected readonly keycloak = this.auth.instance;

  protected isConnected = false;

  protected readonly user = signal<UserProfile>({
    name: this.keycloak?.idTokenParsed?.['preferred_username'] ?? 'Utilisateur',
    email: this.keycloak?.idTokenParsed?.['email'] ?? 'Invité',
    role: this.keycloak?.realmAccess?.roles?.includes('admin') ? 'Admin' : 'Utilisateur',
  });

  protected readonly userInitial = computed(() => this.user().name.trim().charAt(0).toUpperCase());

  async logout() {
    await this.keycloak.logout({
      redirectUri: `${environment.url}/auth/callBack`,
    });
  }

  async login() {
    await this.keycloak.login({
      redirectUri: `${environment.url}/auth/callBack`,
      prompt: 'login',
    });
  }

  ngOnInit(): void {
    this.isConnected = this.keycloak?.authenticated;

    this.user.set({
      name: this.keycloak?.idTokenParsed?.['preferred_username'] ?? 'Utilisateur',
      email: this.keycloak?.idTokenParsed?.['email'] ?? 'Invité',
      role: this.keycloak?.realmAccess?.roles?.includes('admin') ? 'Admin' : 'Utilisateur',
    });
  }

  navigateHome(event: Event): void {
    event.preventDefault();
    globalThis.location.href = '/';
  }
}
