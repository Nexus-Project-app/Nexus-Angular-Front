import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import Keycloak from 'keycloak-js';
import { KeycloakEventType } from 'keycloak-angular';


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

  protected readonly keycloak = inject(Keycloak);


  ngOnInit(): void {
    console.log('Login loaded : ' + JSON.stringify(this.keycloak.tokenParsed
    ));
    console.log('Authenticated:' + this.keycloak.authenticated);

    if(this.keycloak.authenticated)
    {
      this.router.navigate(['/home']);
    }

    // Écoute les événements de Keycloak
    this.keycloak.onAuthSuccess = () => {
      console.log('Authentication successful');
      this.router.navigate(['/home']);
    };


  }



  protected login(): void {
    this.loading.set(true);
    this.serverError.set(null);

    this.keycloak.login({
          redirectUri: window.location.origin + '/home',
          prompt: 'login'
        });

  }
}
