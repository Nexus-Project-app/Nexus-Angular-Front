import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@shared/utils/environment';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly keycloak = this.authService.instance;
  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly auth = inject(AuthService);

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.keycloak?.authenticated) {
      void this.router.navigate(['/']);
    }

    // Écoute les événements de Keycloak
    this.keycloak.onAuthSuccess = () => {
      void this.router.navigate(['/']);
    };

    this.keycloak.onAuthError = () => {
      this.loading.set(false);
      this.serverError.set('La connexion a échoué. Vérifiez la configuration Keycloak du client.');
    };
  }

  protected async login() {
    this.loading.set(true);
    this.serverError.set(null);

    await this.keycloak.login({
      redirectUri: environment.url + '/o2/callBack',
      prompt: 'login',
    });
  }
}
