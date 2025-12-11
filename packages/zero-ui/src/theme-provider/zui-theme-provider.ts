
import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { ThemeService, type Theme } from '../services/theme.service.js';

@customElement('zui-theme-provider')
export class ZuiThemeProvider extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      background: transparent;
      border: 1px solid var(--card-border, #e2e8f0);
      color: var(--text-main, #334155);
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    button:hover {
        background: var(--card-bg-hover, rgba(0,0,0,0.05));
    }

    .icon {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `;

  @state() private _theme: Theme = 'system';
  @state() private _resolvedTheme: 'light' | 'dark' = 'light';
  
  @property({ type: Boolean }) showToggle = true;

  connectedCallback() {
    super.connectedCallback();
    ThemeService.subscribe(this._handleThemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ThemeService.unsubscribe(this._handleThemeChange);
  }

  private _handleThemeChange = (theme: Theme, resolved: 'light' | 'dark') => {
    this._theme = theme;
    this._resolvedTheme = resolved;
    this.requestUpdate();
  }

  private _toggleTheme() {
    ThemeService.toggle();
  }

  render() {
      if (!this.showToggle) return html`<slot></slot>`;
      
    // Simple Moon/Sun icons
    const moonIcon = html`<svg class="icon" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
    const sunIcon = html`<svg class="icon" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0 1.41.996.996 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06z"/></svg>`;

    return html`
      <button @click=${this._toggleTheme} title="Toggle theme (Current: ${this._resolvedTheme})">
        ${this._resolvedTheme === 'dark' ? moonIcon : sunIcon}
      </button>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-theme-provider': ZuiThemeProvider;
  }
}
