import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  ngOnInit(): void {
    console.log('Login loaded : ' + JSON.stringify(this.auth.tokenParsed));
    console.log('Authenticated:' + this.auth.authenticated);

    if(this.auth.authenticated)
    {
      this.router.navigate(['/']);
    }

    // Écoute les événements de Keycloak
    this.auth.onAuthSuccess = () => {
      console.log('Authentication successful');
      this.router.navigate(['/']);
    };


  }



  protected login(): void {
    this.loading.set(true);
    this.serverError.set(null);

    this.auth.login({
          redirectUri: environment.url + '/auth/callBack',
          prompt: 'login'
        });
  }
}
