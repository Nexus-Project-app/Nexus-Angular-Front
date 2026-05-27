import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'me',
    loadComponent: () =>
      import('./presentation/profile/profile.component').then((m) => m.ProfileComponent),
  },
];
