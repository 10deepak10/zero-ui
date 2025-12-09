export type Theme = 'dark' | 'light';
export type ThemeChangeCallback = (theme: Theme) => void;

export class ThemeCheckService {
  private static _listeners: Set<ThemeChangeCallback> = new Set();
  private static _mediaQuery: MediaQueryList | null = null;

  static getTheme(): Theme {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  static subscribe(callback: ThemeChangeCallback): void {
    this._listeners.add(callback);
    this._initListener();
    // Immediate callback
    callback(this.getTheme());
  }

  static unsubscribe(callback: ThemeChangeCallback): void {
    this._listeners.delete(callback);
    if (this._listeners.size === 0) {
      this._removeListener();
    }
  }

  private static _handleChange = (e: MediaQueryListEvent) => {
    const theme: Theme = e.matches ? 'dark' : 'light';
    this._listeners.forEach(cb => cb(theme));
  };

  private static _initListener() {
    if (!this._mediaQuery) {
      this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this._mediaQuery.addEventListener('change', this._handleChange);
    }
  }

  private static _removeListener() {
    if (this._mediaQuery) {
      this._mediaQuery.removeEventListener('change', this._handleChange);
      this._mediaQuery = null;
    }
  }
}
