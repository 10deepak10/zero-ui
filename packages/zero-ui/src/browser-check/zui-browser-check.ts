import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BrowserCheckService, type BrowserInfo } from '../services/browser.service.js';

@customElement('zui-browser-check')
export class ZuiBrowserCheck extends LitElement {
  @property({ type: Boolean }) showIcon = true;
  @property({ type: Boolean }) showVersion = false;

  @state() private _browserInfo: BrowserInfo | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .browser-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
    }

    .browser-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--link-active-bg, rgba(59, 130, 246, 0.1));
      border-radius: 8px;
    }

    .browser-info {
      flex: 1;
    }

    .browser-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-main, #fff);
      margin-bottom: 4px;
    }

    .browser-version {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
    }

    .browser-engine {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      opacity: 0.7;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._detectBrowser();
  }

  private _detectBrowser() {
    this._browserInfo = BrowserCheckService.getBrowserInfo();

    this.dispatchEvent(new CustomEvent('browser-detected', {
      bubbles: true,
      composed: true,
      detail: this._browserInfo
    }));
  }

  private _getBrowserIcon(browserName: string) {
    const icons: Record<string, any> = {
      'Chrome': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" fill="#4285F4"/>
        </svg>
      `,
      'Firefox': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4Z" fill="#FF7139"/>
        </svg>
      `,
      'Safari': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6L15.5,10.5L12,18L8.5,13.5L12,6Z" fill="#006CFF"/>
        </svg>
      `,
      'Edge': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7Z" fill="#0078D7"/>
        </svg>
      `,
      'Opera': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6C14.21,6 16,8.69 16,12C16,15.31 14.21,18 12,18C9.79,18 8,15.31 8,12C8,8.69 9.79,6 12,6Z" fill="#FF1B2D"/>
        </svg>
      `,
      'Brave': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2L3,7V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V7L12,2M12,4.18L19,8.18V11C19,15.42 16.12,19.44 12,20.81C7.88,19.44 5,15.42 5,11V8.18L12,4.18M12,7L9.5,12L12,14L14.5,12L12,7Z" fill="#FB542B"/>
        </svg>
      `,
      'Unknown': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" fill="#9CA3AF"/>
        </svg>
      `
    };
    return icons[browserName] || icons['Unknown'];
  }

  render() {
    if (!this._browserInfo) {
      return html`<div class="browser-container">Detecting browser...</div>`;
    }

    return html`
      <div class="browser-container">
        ${this.showIcon ? html`
          <div class="browser-icon">${this._getBrowserIcon(this._browserInfo.name)}</div>
        ` : ''}
        <div class="browser-info">
          <div class="browser-name">${this._browserInfo.name}</div>
          ${this.showVersion && this._browserInfo.version ? html`
            <div class="browser-version">Version: ${this._browserInfo.version}</div>
          ` : ''}
          <div class="browser-engine">Engine: ${this._browserInfo.engine}</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-browser-check': ZuiBrowserCheck;
  }
}
