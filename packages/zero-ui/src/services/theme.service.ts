
export type Theme = 'light' | 'dark' | 'system';

export type ThemeCallback = (theme: Theme, resolvedTheme: 'light' | 'dark') => void;

export class ThemeService {
  private static _currentTheme: Theme = 'system';
  private static _listeners: Set<ThemeCallback> = new Set();
  private static _mediaQuery: MediaQueryList | null = null;

  static {
    // Initialize from storage or default
    const stored = localStorage.getItem('zui-theme') as Theme;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      this._currentTheme = stored;
    }

    if (typeof window !== 'undefined') {
      this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this._mediaQuery.addEventListener('change', () => this._notify());

      // Initial application
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
    localStorage.setItem('zui-theme', theme);
    this._notify();
  }

  static toggle() {
    const current = this.getResolvedTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  static subscribe(callback: ThemeCallback) {
    this._listeners.add(callback);
    // Immediately notify with current state
    callback(this._currentTheme, this.getResolvedTheme());
  }

  static unsubscribe(callback: ThemeCallback) {
    this._listeners.delete(callback);
  }

  private static _notify() {
    const resolved = this.getResolvedTheme();

    // Apply to document
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

// Legacy service for ZuiThemeCheck (System preference detection only)
export class ThemeCheckService {
  private static _listeners: Set<(theme: 'light' | 'dark') => void> = new Set();
  private static _mediaQuery: MediaQueryList | null = null;

  static {
    if (typeof window !== 'undefined') {
      this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this._mediaQuery.addEventListener('change', () => this._notify());
    }
  }

  static getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined' || !this._mediaQuery) return 'light';
    return this._mediaQuery.matches ? 'dark' : 'light';
  }

  static subscribe(callback: (theme: 'light' | 'dark') => void) {
    this._listeners.add(callback);
    callback(this.getTheme());
  }

  static unsubscribe(callback: (theme: 'light' | 'dark') => void) {
    this._listeners.delete(callback);
  }

  private static _notify() {
    const theme = this.getTheme();
    this._listeners.forEach(cb => cb(theme));
  }
}
