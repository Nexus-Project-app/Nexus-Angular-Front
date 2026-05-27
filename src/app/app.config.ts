import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { USER_REPOSITORY } from './features/auth/application/ports/user.repository';
import { UserApi } from './features/auth/infrastructure/user.api';
import { AuthService } from './shared/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserApi,
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    // Initialize AuthService but do not block application bootstrap.
    // Keycloak init may perform network calls (silent SSO) which can hang
    // the bootstrap if returned promise is awaited. Start init asynchronously
    // and let the app render immediately.
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      // fire-and-forget initialization
      void authService.init().catch(() => {});
      return Promise.resolve();
    }),
  ],
};
