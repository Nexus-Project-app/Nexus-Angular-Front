import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (auth.authenticated) {
    return true;
  }

  if (isPlatformBrowser(platformId)) {
    void auth.login();
    return false;
  }

  return router.createUrlTree(['/']);
};
