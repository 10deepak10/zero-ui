import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ClipboardCheckService, type ClipboardPermissionStatus, type ClipboardHistoryItem } from '../services/clipboard.service.js';

@customElement('zui-clipboard-check')
export class ZuiClipboardCheck extends LitElement {
  @state() private _permission: ClipboardPermissionStatus = 'prompt';
  @state() private _clipboardContent = '';
  @state() private _writeText = 'Hello from Zero UI!';
  @state() private _error: string | null = null;
  @state() private _successMessage: string | null = null;
  @state() private _isReading = false;
  @state() private _isWriting = false;
  @state() private _history: ClipboardHistoryItem[] = [];

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .title {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge {
      font-size: 0.8rem;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-granted { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-denied { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .status-prompt { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

    .action-area {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
    }

    .info-msg {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      margin-bottom: 8px;
    }

    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      align-self: flex-start;
    }

    button:hover {
      background: #2563eb;
    }

    button:disabled {
      background: #1f2937;
      color: #6b7280;
      cursor: not-allowed;
    }

    .test-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 16px;
    }

    .test-group {
      background: var(--bg-muted, rgba(255, 255, 255, 0.05));
      padding: 16px;
      border-radius: 8px;
    }

    .test-group-title {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    input, textarea {
      background: var(--zui-input-bg, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      color: var(--text-main, white);
      padding: 8px 12px;
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
      font-family: monospace;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .error-msg {
      color: #f87171;
      font-size: 0.9rem;
      margin-top: 8px;
    }

    .success-msg {
      color: #34d399;
      font-size: 0.9rem;
      margin-top: 8px;
    }

    .clipboard-display {
      background: var(--zui-input-bg, rgba(0, 0, 0, 0.3));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      padding: 12px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 0.9rem;
      color: #d1d5db;
      min-height: 60px;
      margin-top: 12px;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .empty-state {
      color: var(--text-muted, #9ca3af);
      font-style: italic;
    }

    .history-section {
      margin-top: 24px;
      border-top: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      padding-top: 20px;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .clear-btn {
      background: transparent;
      color: var(--text-muted, #9ca3af);
      font-size: 0.8rem;
      padding: 4px 8px;
    }

    .clear-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f87171;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 300px;
      overflow-y: auto;
    }

    .history-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--bg-muted, rgba(255, 255, 255, 0.03));
      padding: 10px;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .history-badge {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 600;
      flex-shrink: 0;
    }

    .badge-read { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .badge-write { background: rgba(16, 185, 129, 0.2); color: #34d399; }

    .history-content {
      flex: 1;
      overflow: hidden;
    }

    .history-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }

    .history-meta {
      font-size: 0.75rem;
      color: var(--text-muted, #9ca3af);
      display: flex;
      justify-content: space-between;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    this._permission = await ClipboardCheckService.checkPermission();
    ClipboardCheckService.subscribe(this._handlePermissionChange);
    ClipboardCheckService.subscribeToHistory(this._handleHistoryChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ClipboardCheckService.unsubscribe(this._handlePermissionChange);
    ClipboardCheckService.unsubscribeFromHistory(this._handleHistoryChange);
  }

  private _handleHistoryChange = (history: ClipboardHistoryItem[]) => {
    this._history = history;
  };

  private _clearHistory() {
    ClipboardCheckService.clearHistory();
  }

  private _handlePermissionChange = (status: ClipboardPermissionStatus) => {
    this._permission = status;
  };

  private async _requestPermission() {
    this._error = null;
    this._successMessage = null;
    
    try {
      // Trigger permission by attempting to read
      await ClipboardCheckService.readText();
      this._permission = 'granted';
      this._successMessage = 'Clipboard access granted!';
    } catch (e) {
      if (e instanceof Error && e.message.includes('denied')) {
        this._permission = 'denied';
        this._error = 'Clipboard access denied. Please enable it in your browser settings.';
      } else {
        this._error = 'Failed to request clipboard permission';
      }
    }
  }

  private async _readClipboard() {
    this._isReading = true;
    this._error = null;
    this._successMessage = null;

    try {
      const text = await ClipboardCheckService.readText();
      this._clipboardContent = text;
      this._successMessage = 'Clipboard read successfully!';
    } catch (e) {
      this._error = e instanceof Error ? e.message : 'Failed to read clipboard';
      this._clipboardContent = '';
    } finally {
      this._isReading = false;
    }
  }

  private async _writeClipboard() {
    this._isWriting = true;
    this._error = null;
    this._successMessage = null;

    try {
      await ClipboardCheckService.writeText(this._writeText);
      this._successMessage = 'Text copied to clipboard!';
    } catch (e) {
      this._error = e instanceof Error ? e.message : 'Failed to write to clipboard';
    } finally {
      this._isWriting = false;
    }
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this._writeText = target.value;
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <span class="title">Clipboard Access</span>
          <span class="status-badge status-${this._permission}">${this._permission}</span>
        </div>

        ${this._permission === 'prompt' ? html`
          <div class="action-area">
            <p class="info-msg">
              Clipboard access allows reading and writing text to your system clipboard.
            </p>
            <button @click=${this._requestPermission}>
              Request Permission
            </button>
          </div>
        ` : ''}

        ${this._permission === 'granted' ? html`
          <div class="test-section">
            <!-- Write to Clipboard -->
            <div class="test-group">
              <div class="test-group-title">Write to Clipboard</div>
              <input 
                type="text" 
                placeholder="Enter text to copy" 
                .value=${this._writeText}
                @input=${this._handleInput}
              >
              <div class="button-group">
                <button @click=${this._writeClipboard} ?disabled=${this._isWriting}>
                  ${this._isWriting ? 'Copying...' : '📋 Copy to Clipboard'}
                </button>
              </div>
            </div>

            <!-- Read from Clipboard -->
            <div class="test-group">
              <div class="test-group-title">Read from Clipboard</div>
              <button @click=${this._readClipboard} ?disabled=${this._isReading}>
                ${this._isReading ? 'Reading...' : '📖 Read Clipboard'}
              </button>
              <div class="clipboard-display">
                ${this._clipboardContent ? this._clipboardContent : html`<span class="empty-state">Clipboard content will appear here...</span>`}
              </div>
            </div>
          </div>

          ${this._history.length > 0 ? html`
            <div class="history-section">
              <div class="history-header">
                <div class="title">Session History</div>
                <button class="clear-btn" @click=${this._clearHistory}>Clear History</button>
              </div>
              <div class="history-list">
                ${this._history.map(item => html`
                  <div class="history-item">
                    <span class="history-badge badge-${item.type}">${item.type}</span>
                    <div class="history-content">
                      <div class="history-text" title="${item.content}">${item.content}</div>
                      <div class="history-meta">
                        <span>${new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          ` : ''}
        ` : ''}

        ${this._permission === 'denied' ? html`
          <div class="error-msg">
            Clipboard access is blocked. Please enable it in your browser settings to verify.
          </div>
        ` : ''}

        ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}
        ${this._successMessage ? html`<div class="success-msg">${this._successMessage}</div>` : ''}
      </div>
    `;
  }
}
