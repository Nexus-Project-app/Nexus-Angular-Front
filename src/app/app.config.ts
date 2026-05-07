import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { USER_REPOSITORY } from './features/auth/application/ports/user.repository';
import { UserApi } from './features/auth/infrastructure/user.api';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserApi,
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init();
    }),
  ],
};
