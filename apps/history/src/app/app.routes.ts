import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./history/history.routes').then((m) => m.historyRoutes),
  },
];
