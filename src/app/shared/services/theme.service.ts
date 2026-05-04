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
    if (isPlatformBrowser(this.platformId)) {
      const next = !this._isDark();
      this._isDark.set(next);
      this.applyClass(next);
      localStorage.setItem('nexus-theme', next ? 'dark' : 'light');
    }
  }

  private applyClass(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
