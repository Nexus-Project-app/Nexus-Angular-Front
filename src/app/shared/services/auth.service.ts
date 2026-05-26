import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak!: Keycloak;
  private initialized = false;
  private isAuthenticated = false;

  async init(): Promise<void> {
    // SSR-safe: only init Keycloak in browser environment
    if (globalThis.window === undefined) {
      return;
    }

    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'mon-realm',
      clientId: 'mon-client',
    });

    this.isAuthenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    });
  }

  async login() {
    if (globalThis.window !== undefined) {
      await this.keycloak.login({
        redirectUri: globalThis.window.location.origin + '/auth/callBack',
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

  get instance() {
    return this.keycloak;
  }
}
