import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { OsCheckService, type OSInfo } from '@deepverse/zero-ui/os-check';

@customElement('zui-os-check')
export class ZuiOsCheck extends LitElement {
  @property({ type: Boolean }) showIcon = true;
  @property({ type: Boolean }) showVersion = false;

  @state() private _osInfo: OSInfo | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .os-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
    }

    .os-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--link-active-bg, rgba(59, 130, 246, 0.1));
      border-radius: 8px;
    }

    .os-info {
      flex: 1;
    }

    .os-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-main, #fff);
      margin-bottom: 4px;
    }

    .os-version {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
    }

    .os-platform {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      opacity: 0.7;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._detectOS();
  }

  private _detectOS() {
    this._osInfo = OsCheckService.getOSInfo();

    this.dispatchEvent(new CustomEvent('os-detected', {
      bubbles: true,
      composed: true,
      detail: this._osInfo
    }));
  }

  private _getOSIcon(osName: string) {
    const icons: Record<string, any> = {
      'Windows': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M0,0 L10,0 L10,10 L0,10 Z M11,0 L24,0 L24,10 L11,10 Z M0,11 L10,11 L10,24 L0,24 Z M11,11 L24,11 L24,24 L11,24 Z" fill="#00A4EF"/>
        </svg>
      `,
      'macOS': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" fill="#555555"/>
        </svg>
      `,
      'iOS': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" fill="#555555"/>
        </svg>
      `,
      'Android': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M17.6,9.48L16.85,8.82C17.3,8 17.58,7.15 17.58,6.29C17.58,3.82 15.76,2 13.29,2C11.76,2 10.39,2.81 9.62,4.05L8.97,3.4C8.78,3.21 8.5,3.21 8.31,3.4C8.12,3.59 8.12,3.87 8.31,4.06L9.21,4.96C8.46,6.15 8.04,7.58 8.04,9.11C8.04,13.05 11.24,16.25 15.18,16.25C16.71,16.25 18.14,15.83 19.33,15.08L20.23,15.98C20.42,16.17 20.7,16.17 20.89,15.98C21.08,15.79 21.08,15.51 20.89,15.32L20.24,14.67C21.48,13.9 22.29,12.53 22.29,11C22.29,9.47 21.48,8.1 20.24,7.33L19.59,6.68C19.4,6.49 19.12,6.49 18.93,6.68C18.74,6.87 18.74,7.15 18.93,7.34L19.58,7.99C20.5,8.58 21.08,9.73 21.08,11C21.08,12.27 20.5,13.42 19.58,14.01L18.93,14.66C18.74,14.85 18.74,15.13 18.93,15.32C19.12,15.51 19.4,15.51 19.59,15.32L20.24,14.67C21.48,13.9 22.29,12.53 22.29,11C22.29,10.14 22.01,9.29 21.56,8.47L20.89,7.8C21.08,7.61 21.08,7.33 20.89,7.14C20.7,6.95 20.42,6.95 20.23,7.14L19.33,8.04C18.14,7.29 16.71,6.87 15.18,6.87C11.24,6.87 8.04,10.07 8.04,14.01C8.04,15.54 8.46,16.97 9.21,18.16L8.31,19.06C8.12,19.25 8.12,19.53 8.31,19.72C8.5,19.91 8.78,19.91 8.97,19.72L9.62,19.07C10.39,20.31 11.76,21.12 13.29,21.12C15.76,21.12 17.58,19.3 17.58,16.83C17.58,15.97 17.3,15.12 16.85,14.3L17.6,13.64C17.79,13.45 17.79,13.17 17.6,12.98C17.41,12.79 17.13,12.79 16.94,12.98L16.19,13.64C15.37,12.81 14.27,12.31 13.05,12.31C10.58,12.31 8.58,14.31 8.58,16.78C8.58,19.25 10.58,21.25 13.05,21.25C14.27,21.25 15.37,20.75 16.19,19.92L16.94,20.67C17.13,20.86 17.41,20.86 17.6,20.67C17.79,20.48 17.79,20.2 17.6,20.01L16.85,19.26C17.3,18.44 17.58,17.59 17.58,16.73C17.58,14.26 15.76,12.44 13.29,12.44C11.76,12.44 10.39,13.25 9.62,14.49L8.97,13.84C8.78,13.65 8.5,13.65 8.31,13.84C8.12,14.03 8.12,14.31 8.31,14.5L9.21,15.4C8.46,16.59 8.04,18.02 8.04,19.55C8.04,23.49 11.24,26.69 15.18,26.69C16.71,26.69 18.14,26.27 19.33,25.52L20.23,26.42C20.42,26.61 20.7,26.61 20.89,26.42C21.08,26.23 21.08,25.95 20.89,25.76L17.6,9.48Z" fill="#3DDC84"/>
        </svg>
      `,
      'Linux': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4M11,6V13H13V6H11M11,15V17H13V15H11Z" fill="#FCC624"/>
        </svg>
      `,
      'ChromeOS': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" fill="#4285F4"/>
        </svg>
      `,
      'Unknown': html`
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" fill="#9CA3AF"/>
        </svg>
      `
    };
    return icons[osName] || icons['Unknown'];
  }

  render() {
    if (!this._osInfo) {
      return html`<div class="os-container">Detecting OS...</div>`;
    }

    return html`
      <div class="os-container">
        ${this.showIcon ? html`
          <div class="os-icon">${this._getOSIcon(this._osInfo.name)}</div>
        ` : ''}
        <div class="os-info">
          <div class="os-name">${this._osInfo.name}</div>
          ${this.showVersion && this._osInfo.version ? html`
            <div class="os-version">Version: ${this._osInfo.version}</div>
          ` : ''}
          <div class="os-platform">Platform: ${this._osInfo.platform}</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-os-check': ZuiOsCheck;
  }
}
