import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { authNotificationInterceptor, authTokenInterceptor } from '@andersen/auth';

import { appRoutes } from './app.routes';
import { AUTH_PROVIDERS } from './auth/core/auth.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authTokenInterceptor, authNotificationInterceptor])),
    ...AUTH_PROVIDERS,
  ],
};
