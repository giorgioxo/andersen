import { Provider } from '@angular/core';

import { AUTH_TOKEN_STORAGE } from '@andersen/auth';

import { AuthSessionService } from '../services/auth-session.service';

export const AUTH_PROVIDERS: Provider[] = [
  {
    provide: AUTH_TOKEN_STORAGE,
    useExisting: AuthSessionService,
  },
];
