import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ShellSessionService } from '../services/shell-session.service';

export const authGuard: CanActivateFn = () => {
  const shellSessionService = inject(ShellSessionService);
  const router = inject(Router);

  if (shellSessionService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/sign-in']);
};
