import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ThemeCheckService, type Theme } from '../services/theme.service.js';

@customElement('zui-theme-check')
export class ZuiThemeCheck extends LitElement {
  @state() private _theme: Theme = 'light';

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .icon {
      font-size: 3rem;
      margin-bottom: 8px;
    }

    .title {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-main, #fff);
      text-transform: capitalize;
    }

    .description {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      max-width: 250px;
      line-height: 1.4;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._theme = ThemeCheckService.getTheme();
    ThemeCheckService.subscribe(this._handleThemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ThemeCheckService.unsubscribe(this._handleThemeChange);
  }

  private _handleThemeChange = (theme: Theme) => {
    this._theme = theme;
  };

  render() {
    const isDark = this._theme === 'dark';
    return html`
      <div class="card">
        <div class="icon">${isDark ? '🌙' : '☀️'}</div>
        <div>
          <div class="title">System Theme</div>
          <div class="value">${this._theme} Mode</div>
        </div>
        <div class="description">
          ${isDark 
            ? 'Your system is currently in dark mode.' 
            : 'Your system is currently in light mode.'}
        </div>
      </div>
    `;
  }
}
