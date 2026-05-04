import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callBack',
  templateUrl: './callBack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})

export class CallBackComponent {
    protected readonly keycloak = inject(Keycloak);
    protected readonly router = inject(Router);

    protected readonly notConnected = signal<Boolean>(false);

    ngOnInit(): void {
        console.log('CallBack loaded : ' + JSON.stringify(this.keycloak.tokenParsed));
        console.log('Authenticated:' + this.keycloak.authenticated);
        this.notConnected.set(this.keycloak.authenticated);
    }

    loginMicrosoft() {
        this.keycloak.login({
            idpHint: 'microsoft',
        });
    }

    loginGithub() {
        this.keycloak.login({
            idpHint: 'github',
        });
    }

    isAdmin(): boolean {
        const roles = this.keycloak.tokenParsed?.realm_access?.roles || [];
        return roles.includes('admin');
    }

    goToDashboard() {
       console.log('Navigating to dashboard');
       
       this.router.navigate(['/']);    

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
