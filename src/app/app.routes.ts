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
    path: 'policy',
    loadChildren: () =>
      import('./features/privacy-policy/privacy-policy.routes').then(
        (m) => m.PRIVACY_POLICY_ROUTES
      ),
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('./features/editor/editor.routes').then((m) => m.EDITOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
