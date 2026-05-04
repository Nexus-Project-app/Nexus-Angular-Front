import { Routes } from '@angular/router';
import { AUTH_PORT } from './application/ports/auth.port';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { MockAuthService } from './infrastructure/mock-auth.service';

export const authRoutes: Routes = [
  {
    path: '',
    providers: [
      { provide: AUTH_PORT, useClass: MockAuthService },
      LoginUseCase,
    ],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./presentation/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'callBack',
        loadComponent: () =>
          import('./presentation/callBack/callBack.component').then((m) => m.CallBackComponent),
      },
    ],
  },
];
