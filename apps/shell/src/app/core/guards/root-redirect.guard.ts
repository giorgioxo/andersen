import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ShellSessionService } from '../services/shell-session.service';

export const rootRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const shellSessionService = inject(ShellSessionService);

  if (shellSessionService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  return router.createUrlTree(['/auth/sign-in']);
};
