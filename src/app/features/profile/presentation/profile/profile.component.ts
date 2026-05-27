import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserProfile } from '../../domain/user.model';
import { NavbarComponent } from '../../../../shared/components/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NavbarComponent],
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly keycloak = this.authService.instance;

  loading = signal(true);

  protected readonly notConnected = signal<boolean>(true);

  avatarPreview = signal<string | null>(null);

  selectedAvatar = signal<File | null>(null);

  userProfile = signal<UserProfile>({
    id: '',
    lastName: '',
    firstName: '',
    password: '',
    DateDeCreation: new Date(),
    DateDeModification: new Date(),
    email: '',
    role: '',
    avatarUrl: '',
  });

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],

    lastName: ['', [Validators.required, Validators.minLength(2)]],

    email: [{ value: '', disabled: true }],

    currentPassword: [''],

    password: ['', [Validators.minLength(6)]],

    confirmPassword: [''],
  });

  ngOnInit() {
    if (!this.keycloak.authenticated) {
      this.notConnected.set(true);
      this.loading.set(false);
      this.router.navigate(['/']);
      return;
    }

    this.notConnected.set(false);

    const token = this.keycloak.tokenParsed;

    const profile: UserProfile = {
      id: token?.sub ?? '',
      firstName: token?.['given_name'] ?? '',
      lastName: token?.['family_name'] ?? '',
      email: token?.['email'] ?? '',
      role: this.extractRole(),
      password: '',
      avatarUrl: '',
      DateDeCreation: new Date(),
      DateDeModification: new Date(),
    };

    this.userProfile.set(profile);

    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    });

    this.loading.set(false);
  }

  private extractRole(): string {
    const roles = this.keycloak.tokenParsed?.realm_access?.roles ?? [];

    if (!roles.length) {
      return 'Utilisateur';
    }

    if (roles.includes('admin')) {
      return 'Administrateur';
    }

    return roles[0];
  }

  onAvatarSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      console.error('Le fichier doit être une image');
      return;
    }

    this.selectedAvatar.set(file);

    const reader = new FileReader();

    reader.onload = () => {
      this.avatarPreview.set(reader.result as string);

      this.userProfile.update(profile => ({
        ...profile,
        avatarUrl: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const values = this.profileForm.getRawValue();

    if (values.password && values.password !== values.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas');
      return;
    }

    const updatedProfile: UserProfile = {
      ...this.userProfile(),
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      password: values.password ?? '',
      DateDeModification: new Date(),
    };

    this.userProfile.set(updatedProfile);

    console.log('Profil sauvegardé', updatedProfile);

    if (this.selectedAvatar()) {
      console.log('Avatar à upload :', this.selectedAvatar());
    }
  }

  async logout() {
    await this.authService.instance.logout();
  }

  async goBack() {
    await this.router.navigate(['/']);
  }

  get firstName() {
    return this.profileForm.controls.firstName;
  }

  get lastName() {
    return this.profileForm.controls.lastName;
  }

  get password() {
    return this.profileForm.controls.password;
  }

  get confirmPassword() {
    return this.profileForm.controls.confirmPassword;
  }
}
