import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'policy',
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./modules/privacy-policy/privacy-policy.routes').then(
        (m) => m.PRIVACY_POLICY_ROUTES
      ),
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('./modules/editor/editor.routes').then((m) => m.EDITOR_ROUTES),
  },
];
