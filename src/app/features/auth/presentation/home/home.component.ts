import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})

export class HomeComponent {
    protected readonly keycloak = inject(Keycloak);
    protected readonly router = inject(Router);

    protected readonly notConnected = signal<Boolean>(false);

    ngOnInit(): void {
        console.log('Home loaded : ' + JSON.stringify(this.keycloak.tokenParsed));
        console.log('Authenticated:' + this.keycloak.authenticated);
        this.notConnected.set(this.keycloak.authenticated);
    }

    loginMicrosoft() {
        this.keycloak.login({
            idpHint: 'microsoft',
            redirectUri: window.location.origin + '/home',
        });
    }

    loginGithub() {
        this.keycloak.login({
            idpHint: 'github',
            redirectUri: window.location.origin + '/home',
        });
    }

    isAdmin(): boolean {
        const roles = this.keycloak.tokenParsed?.realm_access?.roles || [];
        return roles.includes('admin');
    }

    goToDashboard() {
       console.log('Navigating to dashboard');
       this.keycloak.loadUserProfile().then(profile => {
         console.log('User profile loaded:',  this.keycloak.authenticated);
         this.notConnected.set(this.keycloak.authenticated);

       }).catch(error => {
         console.log('Aucun profil utilisateur trouvé ou une erreur est survenue:', this.keycloak.authenticated);
         this.notConnected.set(this.keycloak.authenticated);
       });
    }

    getUserRole(): string {
        const roles = this.keycloak.realmAccess?.roles.includes('admin') ? "Admin" : "Utilisateur";
        return roles;
    }

    getUserInfo(): string {
        const roles = JSON.stringify(this.keycloak);
        return roles;
    }


    logout() {
        this.keycloak.logout();
    }

    login() {
        this.keycloak.login();
    }


}
