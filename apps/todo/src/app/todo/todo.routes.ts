import { Route } from '@angular/router';

export const todoRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./todo.component').then((m) => m.TodoComponent),
  },
];
