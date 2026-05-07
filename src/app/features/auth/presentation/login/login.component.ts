import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import Keycloak from 'keycloak-js';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loginUseCase = inject(LoginUseCase);

  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly auth = inject(Keycloak);

  async ngOnInit() {
    if (this.auth.authenticated) {
      await this.router.navigate(['/']);
    }

    // Écoute les événements de Keycloak
    this.auth.onAuthSuccess = () => {
      await this.router.navigate(['/']);
    };
  }

  protected async login() {
    this.loading.set(true);
    this.serverError.set(null);

    await this.auth.login({
      redirectUri: environment.url + '/auth/callBack',
      prompt: 'login',
    });
  }
}
