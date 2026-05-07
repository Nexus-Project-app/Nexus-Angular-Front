import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUserUseCase, me } from '../../application/use-cases/create-user.use-case';
import { CreateUserDTO } from '../../domain/user.model';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-callBack',
  templateUrl: './callBack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class CallBackComponent {
  private readonly authService = inject(AuthService);
  private readonly createUser = inject(CreateUserUseCase);
  private readonly me = inject(me);
  private readonly router = inject(Router);

  private readonly keycloak = this.authService.instance;

  loading = signal(true);

  createUserDto = signal<CreateUserDTO>({
    email: '',
    keycloakId: '',
    firstName: '',
    lastName: '',
  });

  protected readonly notConnected = signal<boolean>(true);

  ngOnInit() {
    // Keycloak n'est pas disponible côté serveur (SSR) : on sort proprement
    if (!this.keycloak) {
      this.loading.set(false);
      return;
    }

    this.notConnected.set(!this.keycloak.authenticated);

    this.createUserDto.set({
      email: this.keycloak.idTokenParsed?.['email'] ?? '',
      keycloakId: this.keycloak.idTokenParsed?.sub ?? '',
      firstName: this.keycloak.idTokenParsed?.['preferred_username'] ?? '',
      lastName: this.keycloak.idTokenParsed?.['family_name'] ?? '',
    });

    if (this.keycloak.authenticated) {
      this.notConnected.set(false);
      this.createUser.execute(this.createUserDto()).subscribe(() => {});
      this.me.execute().subscribe();
    }

    setTimeout(() => {
      this.loading.set(false);
    }, 1200);
  }

  async goToDashboard() {
    await this.router.navigate(['/']);
    this.keycloak
      .loadUserProfile()
      .then(() => {
        this.notConnected.set(this.keycloak.authenticated);
      })
      .catch(() => {
        this.notConnected.set(this.keycloak.authenticated);
      });
  }

  isAdmin(): boolean {
    const roles = this.keycloak.tokenParsed?.realm_access?.roles ?? [];
    return roles.includes('admin');
  }

  getUserRole(): string {

    return this.keycloak?.realmAccess?.roles.includes('admin') ? 'Admin' : 'Utilisateur';
  }

  async logout() {
    await this.keycloak.logout();
  }

  async login() {
    await this.keycloak.login();
  }

  async loginGithub() {
    await this.keycloak.login({
      idpHint: 'github',
    });
  }
}
