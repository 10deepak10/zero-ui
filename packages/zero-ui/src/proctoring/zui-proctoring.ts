import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ProctoringService, type ProctoringConfig, type ViolationEvent } from '../services/proctoring.service.js';

@customElement('zui-proctoring')
export class ZuiProctoring extends LitElement {
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

    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .config-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .status-active {
      color: #34d399;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    button {
      background: var(--button-bg, #3b82f6);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    button.stop-btn {
      background: #ef4444;
    }

    .violation-log {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      max-height: 300px;
      overflow-y: auto;
    }

    .log-header {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted, #9ca3af);
    }

    .log-list {
      display: flex;
      flex-direction: column;
    }

    .log-item {
      padding: 10px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .log-item:last-child {
      border-bottom: none;
    }

    .violation-badge {
      font-size: 0.75rem;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .badge-tab-switch { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .badge-fullscreen-exit { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge-copy-paste { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .badge-others { background: rgba(107, 114, 128, 0.2); color: #9ca3af; }

    .empty-log {
      padding: 24px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
    }
  `;

  @property({ type: Object })
  config: ProctoringConfig = {
    detectTabSwitch: true,
    forceFullscreen: true,
    preventCopyPaste: true,
    preventContextMenu: true,
    detectDevTools: true,
  };

  @state()
  private _isActive = false;

  @state()
  private _violations: ViolationEvent[] = [];

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopSession();
  }

  startSession() {
    ProctoringService.subscribe(this._handleViolation);
    ProctoringService.startSession(this.config);
    this._isActive = true;
    this._violations = [];

    if (this.config.forceFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed', err);
      });
    }
  }

  stopSession() {
    ProctoringService.unsubscribe(this._handleViolation);
    ProctoringService.endSession();
    this._isActive = false;
    
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.warn('Exit fullscreen failed', err));
    }
  }

  private _handleViolation = (event: ViolationEvent) => {
    // Add to beginning of list
    this._violations = [event, ...this._violations];
    this.requestUpdate();
  }

  private _getBadgeClass(type: string) {
    switch (type) {
      case 'tab-switch': return 'badge-tab-switch';
      case 'fullscreen-exit': return 'badge-fullscreen-exit';
      case 'copy-paste': return 'badge-copy-paste';
      default: return 'badge-others';
    }
  }

  render() {
    return html`
      <div class="card">
        <h3>Proctoring Session</h3>
        
        <div class="config-grid">
          <div class="config-item">
            <span class="${this.config.detectTabSwitch ? 'status-active' : ''}">●</span> Tab Monitoring
          </div>
          <div class="config-item">
            <span class="${this.config.forceFullscreen ? 'status-active' : ''}">●</span> Force Fullscreen
          </div>
          <div class="config-item">
            <span class="${this.config.preventCopyPaste ? 'status-active' : ''}">●</span> Prevent Copy/Paste
          </div>
          <div class="config-item">
             <span class="${this.config.preventContextMenu ? 'status-active' : ''}">●</span> Prevent Context Menu
          </div>
           <div class="config-item">
             <span class="${this.config.detectDevTools ? 'status-active' : ''}">●</span> Detect DevTools
          </div>
        </div>

        <div class="controls">
          ${!this._isActive ? html`
            <button @click=${this.startSession}>Start Session</button>
          ` : html`
            <button class="stop-btn" @click=${this.stopSession}>End Session</button>
          `}
        </div>

        <div class="violation-log">
          <div class="log-header">
            <span>Violation Log</span>
            <span>Count: ${this._violations.length}</span>
          </div>
          
          ${this._violations.length > 0 ? html`
            <div class="log-list">
              ${this._violations.map(v => html`
                <div class="log-item">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="violation-badge ${this._getBadgeClass(v.type)}">${v.type}</span>
                    <span style="font-size:0.8rem; opacity:0.8;">${v.message}</span>
                  </div>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${new Date(v.timestamp).toLocaleTimeString()}</span>
                </div>
              `)}
            </div>
          ` : html`
            <div class="empty-log">
              No violations recorded. Trust score is 100%.
            </div>
          `}
        </div>
      </div>
    `;
  }
}
