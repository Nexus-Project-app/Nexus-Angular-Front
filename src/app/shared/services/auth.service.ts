import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../utils/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak!: Keycloak;
  private initialized = false;
  private isAuthenticated = false;

  async init(): Promise<void> {
    if (globalThis.window === undefined) {
      return;
    }
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.keycloak = new Keycloak({
      url: `${environment.keycloakUrl}`,
      realm: `${environment.keycloakRealm}`,
      clientId: `${environment.keycloakClientId}`,
    });


    this.isAuthenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    });
  }

  async login() {
    if (globalThis.window !== undefined) {
      await this.keycloak.login({
        redirectUri: globalThis.window.location.origin + '/o2/callBack',
      });
    }
  }

  async logout() {
    if (globalThis.window !== undefined) {
      await this.keycloak.logout({
        redirectUri: globalThis.window.location.origin,
      });
    }
  }

  get authenticated(): boolean {
    return this.isAuthenticated;
  }

  get instance() {
    return this.keycloak;
  }
}
