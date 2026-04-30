import { Routes } from '@angular/router';

export const PRIVACY_POLICY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/privacy-policy-page/privacy-policy-page.component').then(
        (m) => m.PrivacyPolicyPageComponent
      ),
    title: 'Politique de confidentialité — Nexus',
  },
];
