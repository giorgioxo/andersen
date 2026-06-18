import { Route } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { rootRedirectGuard } from './core/guards/root-redirect.guard';

export const shellRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    children: [],
  },
  {
  path: 'auth',
  loadChildren: () => import('@andersen/login-routes').then((m) => m.authRoutes),
},
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadChildren: () => import('@andersen/todo-routes').then((m) => m.todoRoutes),
},
  {
    path: '**',
    redirectTo: 'auth',
  },
];
