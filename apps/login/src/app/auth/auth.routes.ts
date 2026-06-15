import { Route } from '@angular/router';

import { AuthComponent } from './auth.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: 'registration',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
    ],
  },
];
