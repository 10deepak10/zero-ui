import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ExtensionCheckService, type ExtensionDefinition, type DetectionResult } from '../services/extension.service.js';

@customElement('zui-extension-check')
export class ZuiExtensionCheck extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .card {
      background: var(--card-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 16px;
      backdrop-filter: blur(10px);
      padding: 24px;
      color: var(--text-main, #fff);
    }

    h3 {
      margin: 0 0 16px 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }

    .extension-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--bg-muted, rgba(0, 0, 0, 0.2));
      border-radius: 8px;
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.05));
    }

    .extension-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-detected {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .status-missing {
      background: rgba(107, 114, 128, 0.2);
      color: #9ca3af;
      border: 1px solid rgba(107, 114, 128, 0.4);
    }

    .refresh-btn {
      margin-top: 16px;
      background: var(--button-bg, #3b82f6);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    .refresh-btn:hover {
      opacity: 0.9;
    }
    
    .loading {
      opacity: 0.7;
      pointer-events: none;
    }

    @media (max-width: 600px) {
      .card {
        padding: 16px;
      }
      .status-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  @property({ type: Array })
  extensions: ExtensionDefinition[] = [];

  @state()
  private _results: DetectionResult[] = [];

  @state()
  private _loading = false;

  connectedCallback() {
    super.connectedCallback();
    this.checkExtensions();
  }

  async checkExtensions() {
    this._loading = true;
    this._results = [];
    
    this._results = await ExtensionCheckService.checkExtensions(this.extensions);
    
    this._loading = false;
    
    this.dispatchEvent(new CustomEvent('zui-extension-check-complete', {
      detail: { results: this._results }
    }));
  }

  render() {
    return html`
      <div class="card ${this._loading ? 'loading' : ''}">
        <h3>Browser Extensions</h3>
        <p style="opacity: 0.7; font-size: 0.9rem; margin-bottom: 16px;">
          Detects detected extensions via injected DOM elements or window properties.
        </p>

        <div class="status-grid">
          ${this._results.map(res => html`
            <div class="extension-item">
              <div class="extension-info">
                <span>${res.name}</span>
              </div>
              <span class="status-badge ${res.detected ? 'status-detected' : 'status-missing'}">
                ${res.detected ? 'Detected' : 'Not Found'}
              </span>
            </div>
          `)}
          ${this._results.length === 0 && !this._loading ? html`
            <div style="grid-column: 1/-1; text-align: center; opacity: 0.6; padding: 20px;">
              No extensions to check defined.
            </div>
          ` : ''}
        </div>

        <button class="refresh-btn" @click=${this.checkExtensions} ?disabled=${this._loading}>
          ${this._loading ? 'Checking...' : 'Check Again'}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-extension-check': ZuiExtensionCheck;
  }
}
