import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '@app/shared/utils/env/environment';

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

    try {
      const initPromise = this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      });

      // Timeout after 5 seconds to prevent hanging bootstrap
      const timeoutPromise = new Promise<boolean>(resolve => {
        setTimeout(() => resolve(false), 5000);
      });

      this.isAuthenticated = await Promise.race([initPromise, timeoutPromise]);
    } catch (error) {
      // If code exchange fails (e.g. unauthorized_client), keep the app usable.
      this.isAuthenticated = false;
      this.clearOidcParamsFromUrl();
      console.error('Keycloak init failed:', error);
    }
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

  async accountManagement(): Promise<void> {
    if (globalThis.window !== undefined) {
      await this.keycloak.accountManagement();
    }
  }

  get authenticated(): boolean {
    return this.isAuthenticated;
  }

  get instance() {
    return this.keycloak;
  }

  private clearOidcParamsFromUrl(): void {
    if (globalThis.window === undefined) {
      return;
    }

    const url = new URL(globalThis.window.location.href);
    const oidcParams = ['code', 'state', 'session_state', 'iss', 'error', 'error_description'];
    let changed = false;

    for (const param of oidcParams) {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        changed = true;
      }
    }

    if (changed) {
      globalThis.window.history.replaceState({}, '', url.toString());
    }
  }
}
