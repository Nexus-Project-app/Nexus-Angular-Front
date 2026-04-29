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
  }
];
