import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideKeycloak } from 'keycloak-angular';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideKeycloak({
      config: {
        
        url : 'https://groupe5.diiage.org/auth',
        realm: 'nexus',
        clientId: 'nexus-client'
      
        // 
        //*

        // url: 'http://localhost:8080',
        // realm: 'mon-realm',
        // clientId: 'mon-client'
      
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: undefined  
      }
    })
  ]
};
