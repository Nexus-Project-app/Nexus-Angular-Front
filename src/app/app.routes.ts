import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/presentation/home.page').then(
        (module) => module.HomePageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
    pathMatch: 'full',
    redirectTo: 'policy',
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./modules/privacy-policy/privacy-policy.routes').then(
        (m) => m.PRIVACY_POLICY_ROUTES
      ),
  }
];
