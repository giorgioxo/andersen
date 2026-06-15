import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./todo/todo.routes').then((m) => m.todoRoutes),
  },
];
