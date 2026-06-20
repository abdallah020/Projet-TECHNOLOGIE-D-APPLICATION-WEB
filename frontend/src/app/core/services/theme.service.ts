import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
}
