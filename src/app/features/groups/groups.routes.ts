import { Routes } from '@angular/router';

export const groupsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/groups-list/groups-list.component').then(
        (m) => m.GroupsListComponent,
      ),
  },
  {
    path: 'new',
    redirectTo: '',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./presentation/group-detail/group-detail.component').then(
        (m) => m.GroupDetailComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./presentation/edit-group/edit-group.component').then(
        (m) => m.EditGroupComponent,
      ),
  },
];
