import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginComponent } from './login.component';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AUTH_PORT } from '../../application/ports/auth.port';
import { MockAuthService } from '../../infrastructure/mock-auth.service';

import { KeycloakEventType, KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let router: Router;
  let loginUseCase: LoginUseCase;
  let authService: MockAuthService;
  
});
