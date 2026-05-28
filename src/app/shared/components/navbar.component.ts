import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '@shared/services/theme.service';
import { environment } from '@shared/utils/environment';
import { AuthService } from '@shared/services/auth.service';

export interface UserProfile {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  protected readonly themeService = inject(ThemeService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

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
      redirectUri: `${environment.url}/o2/callBack`,
    });
  }

  async login() {
    await this.keycloak.login({
      redirectUri: `${environment.url}/o2/callBack`,
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
    void this.router.navigate(['/']);
  }

  navigateProfile(event: Event): void {
    event.preventDefault();
    void this.router.navigate(['/profile/me']);
  }
}
