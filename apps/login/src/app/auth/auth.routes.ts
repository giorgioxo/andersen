import { Route } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthComponent } from './auth.component';
import { AuthLanguageBridgeService } from './services/auth-language-bridge.service';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    providers: [
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: '/i18n/login/',
          suffix: '.json',
        }),
      }),
      AuthLanguageBridgeService,
    ],
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
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
    ],
  },
];
