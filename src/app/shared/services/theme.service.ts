import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _isDark = signal<boolean>(true);

  readonly isDark = this._isDark.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('nexus-theme');
      const dark = stored === null ? true : stored === 'dark';
      this._isDark.set(dark);
      this.applyClass(dark);
    }
  }

  toggle(): void {
    this.setDark(!this._isDark());
  }

  setDark(dark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      this._isDark.set(dark);
      this.applyClass(dark);
      localStorage.setItem('nexus-theme', dark ? 'dark' : 'light');
    }
  }

  private applyClass(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
