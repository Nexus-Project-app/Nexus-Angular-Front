import { Routes } from '@angular/router';
import { editorDeactivateGuard } from './editor-deactivate.guard';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/editor-page/editor-page.component').then((m) => m.EditorPageComponent),
    canDeactivate: [editorDeactivateGuard],
    title: 'Éditeur — Nexus',
  },
];
