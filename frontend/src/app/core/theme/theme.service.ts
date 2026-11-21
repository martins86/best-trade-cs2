import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemePreference>('dark');

  constructor(@Inject(DOCUMENT) private document: Document) {
    const stored = this.document.defaultView?.localStorage.getItem('cs2mm-theme');
    this.theme.set(stored === 'light' ? 'light' : 'dark');
    this.apply(this.theme());
  }

  toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.document.defaultView?.localStorage.setItem('cs2mm-theme', next);
    this.apply(next);
  }

  private apply(theme: ThemePreference): void {
    this.document.documentElement.dataset['theme'] = theme;
  }
}
