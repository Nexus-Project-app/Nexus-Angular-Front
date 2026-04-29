import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'politique-de-confidentialite',
    loadChildren: () =>
      import('./modules/privacy-policy/privacy-policy.routes').then(
        (m) => m.PRIVACY_POLICY_ROUTES
      ),
  },
];
