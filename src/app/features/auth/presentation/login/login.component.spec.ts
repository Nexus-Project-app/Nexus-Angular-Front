import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginComponent } from './login.component';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AUTH_PORT } from '../../application/ports/auth.port';
import { MockAuthService } from '../../infrastructure/mock-auth.service';

describe('LoginComponent', () => {
  let router: Router;
  const mockExecute = vi.fn();

  beforeEach(async () => {
    mockExecute.mockReset();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AUTH_PORT, useClass: MockAuthService },
        { provide: LoginUseCase, useValue: { execute: mockExecute } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function createFixture() {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    const fixture = createFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('form validation', () => {
    it('marks controls touched and shows errors on empty submit', () => {
      const fixture = createFixture();
      const compiled = fixture.nativeElement as HTMLElement;

      compiled.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      fixture.detectChanges();

      expect(compiled.querySelector('#email-error')).toBeTruthy();
      expect(compiled.querySelector('#password-error')).toBeTruthy();
    });

    it('shows email format error for invalid email', () => {
      const fixture = createFixture();
      const { componentInstance: comp } = fixture;

      comp['emailControl'].setValue('not-an-email');
      comp['emailControl'].markAsTouched();
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('#email-error');
      expect(error?.textContent).toContain('invalide');
    });

    it('shows minlength error for short password', () => {
      const fixture = createFixture();
      const { componentInstance: comp } = fixture;

      comp['passwordControl'].setValue('short');
      comp['passwordControl'].markAsTouched();
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('#password-error');
      expect(error?.textContent).toContain('8');
    });
  });

  describe('onSubmit — success', () => {
    it('calls use-case and navigates to /home', async () => {
      mockExecute.mockReturnValue(of({ accessToken: 'tok', userId: 'u1' }));
      const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      const fixture = createFixture();
      const comp = fixture.componentInstance;
      comp['form'].setValue({ email: 'test@example.com', password: 'password123' });
      comp['onSubmit']();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(mockExecute).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(comp['loading']()).toBeFalsy();
      expect(navSpy).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('onSubmit — error', () => {
    it('shows server error and clears loading', async () => {
      mockExecute.mockReturnValue(
        throwError(() => new Error('Identifiants incorrects.'))
      );

      const fixture = createFixture();
      const comp = fixture.componentInstance;
      comp['form'].setValue({ email: 'test@example.com', password: 'wrongpass1' });
      comp['onSubmit']();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(comp['loading']()).toBeFalsy();
      expect(comp['serverError']()).toBe('Identifiants incorrects.');

      const alert = fixture.nativeElement.querySelector('[aria-live="assertive"]');
      expect(alert?.textContent).toContain('Identifiants incorrects.');
    });
  });

  describe('password toggle', () => {
    it('toggles showPassword signal', () => {
      const fixture = createFixture();
      const comp = fixture.componentInstance;

      expect(comp['showPassword']()).toBeFalsy();
      comp['togglePassword']();
      expect(comp['showPassword']()).toBeTruthy();
      comp['togglePassword']();
      expect(comp['showPassword']()).toBeFalsy();
    });
  });
});
