import { injectTokenStyles, injectBaseStyles } from '../styles/inject.js';

export type Theme = 'light' | 'dark' | 'system';

export type ThemeCallback = (theme: Theme, resolvedTheme: 'light' | 'dark') => void;

export class TokenThemeService {
  private static _currentTheme: Theme = 'system';
  private static _listeners: Set<ThemeCallback> = new Set();
  private static _mediaQuery: MediaQueryList | null = null;

  static {
    injectTokenStyles();
    injectBaseStyles();

    try {
      const stored = localStorage.getItem('zui-theme') as Theme;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        this._currentTheme = stored;
      }
    } catch (e) {
      // Storage access denied
    }

    if (typeof window !== 'undefined') {
      this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this._mediaQuery.addEventListener('change', () => this._notify());
      this._notify();
    }
  }

  static getTheme(): Theme {
    return this._currentTheme;
  }

  static getResolvedTheme(): 'light' | 'dark' {
    if (this._currentTheme === 'system') {
      return this._mediaQuery?.matches ? 'dark' : 'light';
    }
    return this._currentTheme;
  }

  static setTheme(theme: Theme) {
    if (this._currentTheme === theme) return;
    this._currentTheme = theme;
    try {
      localStorage.setItem('zui-theme', theme);
    } catch (e) {
      // Ignore
    }
    this._notify();
  }

  static toggle() {
    const current = this.getResolvedTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  static subscribe(callback: ThemeCallback) {
    this._listeners.add(callback);
    callback(this._currentTheme, this.getResolvedTheme());
  }

  static unsubscribe(callback: ThemeCallback) {
    this._listeners.delete(callback);
  }

  private static _notify() {
    const resolved = this.getResolvedTheme();
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.style.colorScheme = resolved;
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    this._listeners.forEach(cb => cb(this._currentTheme, resolved));
  }
}
