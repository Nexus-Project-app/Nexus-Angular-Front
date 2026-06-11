import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '@shared/services/auth.service';
import { ThemeService } from '@shared/services/theme.service';
import {
  AccessibilityService,
  AppFont,
  FontSize,
  LineHeight,
  LetterSpacing,
} from '@shared/services/accessibility.service';
import { UserProfile } from '@features/profile/domain/user.model';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { environment } from '@app/shared/utils/env/environment';

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
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly themeService = inject(ThemeService);
  protected readonly a11yService = inject(AccessibilityService);

  protected readonly fontSizeOptions: { value: FontSize; label: string; preview: string }[] = [
    { value: 'sm', label: 'Petit', preview: '11px' },
    { value: 'base', label: 'Normal', preview: '14px' },
    { value: 'lg', label: 'Grand', preview: '17px' },
    { value: 'xl', label: 'Très grand', preview: '20px' },
  ];

  protected readonly lineHeightOptions: {
    value: LineHeight;
    label: string;
    y1: number;
    y2: number;
    y3: number;
  }[] = [
    { value: 'normal', label: 'Normal', y1: 5, y2: 10, y3: 15 },
    { value: 'relaxed', label: 'Aéré', y1: 4, y2: 10, y3: 16 },
    { value: 'spacious', label: 'Spacieux', y1: 3, y2: 10, y3: 17 },
  ];

  protected readonly letterSpacingOptions: {
    value: LetterSpacing;
    label: string;
    preview: string;
  }[] = [
    { value: 'normal', label: 'Normal', preview: '0em' },
    { value: 'wide', label: 'Large', preview: '0.05em' },
    { value: 'wider', label: 'Très large', preview: '0.1em' },
  ];

  private readonly keycloak = this.authService.instance;

  loading = signal(true);

  env = signal(environment.apiUrl);

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
    if (!isPlatformBrowser(this.platformId)) {
      this.loading.set(false);
      return;
    }

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

    console.warn(JSON.stringify(this.userProfile()));
  }

  private extractRole(): string {
    const roles = this.keycloak.tokenParsed?.resource_access?.['nexus-client']?.roles ?? [];
    let RealRoles: string;

    if (roles.includes('admin')) {
      RealRoles = 'Administrateur';
    } else {
      RealRoles = 'Utilisateur';
    }

    return RealRoles;
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

      this.userProfile.update((profile) => ({
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
  }

  async openKeycloakProfile(): Promise<void> {
    if (!this.keycloak?.authenticated) {
      return;
    }

    await this.authService.accountManagement();
  }

  setTheme(dark: boolean): void {
    this.themeService.setDark(dark);
  }

  setFont(font: AppFont): void {
    this.a11yService.setFont(font);
  }

  setFontSize(size: FontSize): void {
    this.a11yService.setFontSize(size);
  }

  setLineHeight(lh: LineHeight): void {
    this.a11yService.setLineHeight(lh);
  }

  setLetterSpacing(ls: LetterSpacing): void {
    this.a11yService.setLetterSpacing(ls);
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
