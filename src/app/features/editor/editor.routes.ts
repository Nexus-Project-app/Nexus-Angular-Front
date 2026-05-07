import { Routes } from '@angular/router';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/editor-page/editor-page.component').then((m) => m.EditorPageComponent),
    title: 'Éditeur — Nexus',
  },
];
