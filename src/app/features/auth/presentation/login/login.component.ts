import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../shared/utils/environment';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private readonly router = inject(Router);
  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly auth = inject(AuthService);

  async ngOnInit() {
    if (this.auth.authenticated) {
      await this.router.navigate(['/']);
    }
  }

  protected async login() {
    this.loading.set(true);
    this.serverError.set(null);

    await this.auth.login();
  }
}
