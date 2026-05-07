import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUserUseCase, me } from '../../application/use-cases/create-user.use-case';
import { CreateUserDTO } from '../../domain/user.model';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-callBack',
  templateUrl: './callBack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})

export class CallBackComponent {

    private readonly authService = inject(AuthService);
    private readonly createUser = inject(CreateUserUseCase);
    private readonly me = inject(me)
    private readonly router = inject(Router);

    private readonly keycloak = this.authService.instance;

    loading = signal(true);


    createUserDto = signal<CreateUserDTO>({
        email: '',
        keycloakId: '',
        firstName: '',
        lastName: ''
    });

    protected readonly notConnected = signal<Boolean>(true);

    ngOnInit() {

        this.notConnected.set(this.keycloak.authenticated) 

        this.createUserDto.set({
            email:  this.keycloak?.idTokenParsed?.['email'] || '',
            keycloakId: this.keycloak?.idTokenParsed?.sub || '',
            firstName: this.keycloak?.idTokenParsed?.['preferred_username'] || '',
            lastName: this.keycloak?.idTokenParsed?.['family_name'] || ''
        });


        if (this.keycloak.authenticated) {
            this.notConnected.set(this.keycloak.authenticated);
            this.createUser.execute(this.createUserDto()).subscribe(() => {
                //this.router.navigate(['/']);
            });
            console.log(this.keycloak.token)
        }        

          this.me.execute().subscribe()

          console.log(this.keycloak.tokenParsed)
          console.log(this.keycloak.token)

        setTimeout(() => {
            this.loading.set(false);
        }, 1200);
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

    isAdmin(): boolean {
        const roles = this.keycloak.tokenParsed?.realm_access?.roles || [];
        return roles.includes('admin');
    }

    getUserRole(): string {
        const roles = this.keycloak?.realmAccess?.roles.includes('admin') ? "Admin" : "Utilisateur";
        return roles;
    }

    logout() {
        this.keycloak.logout();
    }

    login() {
        this.keycloak.login();
    }

    loginGithub() {
        this.keycloak.login({
            idpHint: 'github',
        });
    }
}
