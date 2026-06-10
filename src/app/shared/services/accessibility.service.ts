import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppFont = 'system' | 'opendyslexic';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type LineHeight = 'normal' | 'relaxed' | 'spacious';
export type LetterSpacing = 'normal' | 'wide' | 'wider';

const FONT_SIZES: FontSize[] = ['sm', 'base', 'lg', 'xl'];
const LINE_HEIGHTS: LineHeight[] = ['normal', 'relaxed', 'spacious'];
const LETTER_SPACINGS: LetterSpacing[] = ['normal', 'wide', 'wider'];

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _font = signal<AppFont>('system');
  private readonly _fontSize = signal<FontSize>('base');
  private readonly _lineHeight = signal<LineHeight>('normal');
  private readonly _letterSpacing = signal<LetterSpacing>('normal');

  readonly font = this._font.asReadonly();
  readonly fontSize = this._fontSize.asReadonly();
  readonly lineHeight = this._lineHeight.asReadonly();
  readonly letterSpacing = this._letterSpacing.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    const font: AppFont = localStorage.getItem('nexus-font') === 'opendyslexic' ? 'opendyslexic' : 'system';
    const fontSize: FontSize = (FONT_SIZES.find(s => s === localStorage.getItem('nexus-font-size'))) ?? 'base';
    const lineHeight: LineHeight = (LINE_HEIGHTS.find(s => s === localStorage.getItem('nexus-line-height'))) ?? 'normal';
    const letterSpacing: LetterSpacing = (LETTER_SPACINGS.find(s => s === localStorage.getItem('nexus-letter-spacing'))) ?? 'normal';

    this._font.set(font);
    this._fontSize.set(fontSize);
    this._lineHeight.set(lineHeight);
    this._letterSpacing.set(letterSpacing);

    this.applyFont(font);
    this.applyFontSize(fontSize);
    this.applyLineHeight(lineHeight);
    this.applyLetterSpacing(letterSpacing);
  }

  setFont(font: AppFont): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._font.set(font);
    this.applyFont(font);
    localStorage.setItem('nexus-font', font);
  }

  setFontSize(size: FontSize): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._fontSize.set(size);
    this.applyFontSize(size);
    localStorage.setItem('nexus-font-size', size);
  }

  setLineHeight(lh: LineHeight): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._lineHeight.set(lh);
    this.applyLineHeight(lh);
    localStorage.setItem('nexus-line-height', lh);
  }

  setLetterSpacing(ls: LetterSpacing): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._letterSpacing.set(ls);
    this.applyLetterSpacing(ls);
    localStorage.setItem('nexus-letter-spacing', ls);
  }

  private applyFont(font: AppFont): void {
    document.documentElement.classList.toggle('font-opendyslexic', font === 'opendyslexic');
  }

  private applyFontSize(size: FontSize): void {
    document.documentElement.classList.remove('font-size-sm', 'font-size-lg', 'font-size-xl');
    if (size !== 'base') {
      document.documentElement.classList.add(`font-size-${size}`);
    }
  }

  private applyLineHeight(lh: LineHeight): void {
    document.documentElement.classList.remove('line-height-relaxed', 'line-height-spacious');
    if (lh !== 'normal') {
      document.documentElement.classList.add(`line-height-${lh}`);
    }
  }

  private applyLetterSpacing(ls: LetterSpacing): void {
    document.documentElement.classList.remove('letter-spacing-wide', 'letter-spacing-wider');
    if (ls !== 'normal') {
      document.documentElement.classList.add(`letter-spacing-${ls}`);
    }
  }
}
