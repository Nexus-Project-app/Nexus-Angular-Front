import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";


@Injectable({providedIn: 'root'})
export class AuthService {
  private keycloak!: Keycloak;
  private initialized = false;
  private isAuthenticated = false;

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    this.initialized = true;

    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'mon-realm',
      clientId: 'mon-client',
    });

    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,

    });

    this.isAuthenticated = (authenticated);
  }

  login() {
    this.keycloak.login({
      redirectUri: window.location.origin + '/auth/callBack',
    });
  }

  logout() {
    this.keycloak.logout({
      redirectUri: window.location.origin,
    });
  }

  get instance() {
    return this.keycloak;
  }
}