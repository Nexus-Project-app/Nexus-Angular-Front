import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/presentation/home.page').then((m) => m.HomePageComponent),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./features/posts/presentation/post/post-view.component').then((m) => m.PostViewComponent),
  },
  {
    path: 'o2',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./features/privacy-policy/privacy-policy.routes').then(
        (m) => m.PRIVACY_POLICY_ROUTES,
      ),
  },
  {
    path: 'editor',
    loadChildren: () => import('./features/editor/editor.routes').then((m) => m.EDITOR_ROUTES),
  },
];
