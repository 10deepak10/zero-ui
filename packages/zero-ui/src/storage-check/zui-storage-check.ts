import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StorageCheckService, type StorageAvailability, type StorageQuota } from '../services/storage.service.js';

@customElement('zui-storage-check')
export class ZuiStorageCheck extends LitElement {
  @state() private _availability: StorageAvailability | null = null;
  @state() private _quota: StorageQuota | null = null;
  @state() private _loadingQuota = false;

  static styles = css`
    :host {
      display: block;
    }

    .storage-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
    }

    .card-header {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .availability-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot.active {
      background-color: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }

    .status-dot.inactive {
      background-color: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
    }

    .status-name {
      font-size: 0.95rem;
      color: var(--text-main, #fff);
    }

    .quota-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quota-text {
      display: flex;
      justify-content: space-between;
      color: var(--text-main, #fff);
      font-size: 0.95rem;
    }

    .quota-bar-bg {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .quota-bar-fill {
      height: 100%;
      background: #3b82f6;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .loading {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      font-style: italic;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._checkStorage();
  }

  private async _checkStorage() {
    this._availability = StorageCheckService.checkAvailability();
    
    this._loadingQuota = true;
    this._quota = await StorageCheckService.getQuota();
    this._loadingQuota = false;
  }

  private _formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  render() {
    if (!this._availability) return html`<div class="loading">Checking storage...</div>`;

    const usagePercent = this._quota 
      ? Math.min(100, (this._quota.usage / this._quota.quota) * 100) 
      : 0;

    return html`
      <div class="storage-container">
        <div class="card">
          <div class="card-header">Availability</div>
          <div class="availability-grid">
            <div class="status-item">
              <div class="status-dot ${this._availability.localStorage ? 'active' : 'inactive'}"></div>
              <span class="status-name">Local Storage</span>
            </div>
            <div class="status-item">
              <div class="status-dot ${this._availability.sessionStorage ? 'active' : 'inactive'}"></div>
              <span class="status-name">Session Storage</span>
            </div>
            <div class="status-item">
              <div class="status-dot ${this._availability.indexedDB ? 'active' : 'inactive'}"></div>
              <span class="status-name">IndexedDB</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Storage Usage</div>
          ${this._loadingQuota ? html`<div class="loading">Calculating quota...</div>` : this._quota ? html`
            <div class="quota-info">
              
              <div style="display: flex; gap: 8px; flex-direction: column; margin-bottom: 12px;">
                <div class="quota-text">
                   <span style="color: var(--text-muted, #9ca3af);">Global (IDB+Cache):</span>
                   <span>${this._formatBytes(this._quota.usage)}</span>
                </div>
                <div class="quota-text">
                   <span style="color: var(--text-muted, #9ca3af);">Local Storage:</span>
                   <span>${this._formatBytes(this._quota.localStorageUsage)}</span>
                </div>
                <div class="quota-text">
                   <span style="color: var(--text-muted, #9ca3af);">Session Storage:</span>
                   <span>${this._formatBytes(this._quota.sessionStorageUsage)}</span>
                </div>
              </div>

              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                <div class="quota-text" style="margin-bottom: 8px;">
                  <span>Quota Usage</span>
                  <span>${this._formatBytes(this._quota.quota)} Max</span>
                </div>
                <div class="quota-bar-bg">
                  <div class="quota-bar-fill" style="width: ${usagePercent}%"></div>
                </div>
                <div class="quota-text" style="font-size: 0.8rem; color: var(--text-muted, #9ca3af); margin-top: 4px;">
                  ${usagePercent.toFixed(2)}% of available quota
                </div>
              </div>

            </div>
          ` : html`<div class="loading">Quota information unavailable</div>`}
        </div>
      </div>
    `;
  }
}
