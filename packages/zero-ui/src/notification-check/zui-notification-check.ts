import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { NotificationCheckService, type NotificationPermissionStatus } from '../services/notification.service.js';

@customElement('zui-notification-check')
export class ZuiNotificationCheck extends LitElement {
  @state() private _permission: NotificationPermissionStatus = 'default';
  @state() private _error: string | null = null;
  @state() private _customTitle = 'Hello from Zero UI!';
  @state() private _customBody = 'This is a test notification.';

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
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
    .status-default { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

    .action-area {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
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

    .test-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
      background: rgba(255, 255, 255, 0.05);
      padding: 16px;
      border-radius: 8px;
    }

    input, textarea {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .error-msg {
      color: #f87171;
      font-size: 0.9rem;
      margin-top: 4px;
    }
    
    .info-msg {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      margin-bottom: 8px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._permission = NotificationCheckService.getPermission();
  }

  private async _requestPermission() {
    try {
      this._permission = await NotificationCheckService.requestPermission();
    } catch (e) {
      this._error = 'Failed to request permission';
    }
  }

  private _sendTest() {
    this._error = null; // Clear previous errors
    
    const success = NotificationCheckService.sendNotification(this._customTitle, {
      body: this._customBody,
      // Removed icon to prevent potential issues with missing files
      // You can add a valid icon path later if needed
    });
    
    if (!success) {
      this._error = 'Failed to send notification. Check browser console for details.';
    }
  }

  private _handleInput(e: Event, type: 'title' | 'body') {
    const target = e.target as HTMLInputElement;
    if (type === 'title') this._customTitle = target.value;
    else this._customBody = target.value;
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <span class="title">Notification Access</span>
          <span class="status-badge status-${this._permission}">${this._permission}</span>
        </div>

        ${this._permission === 'default' ? html`
          <div class="action-area">
            <p class="info-msg">
              Notifications allow this app to alert you even when it's in the background.
            </p>
            <button @click=${this._requestPermission}>
              Request Permission
            </button>
          </div>
        ` : ''}

        ${this._permission === 'granted' ? html`
          <div class="test-form">
            <div class="title" style="margin-bottom: 4px;">Test Notification</div>
            <input 
              type="text" 
              placeholder="Title" 
              .value=${this._customTitle}
              @input=${(e: Event) => this._handleInput(e, 'title')}
            >
            <input 
              type="text" 
              placeholder="Body message" 
              .value=${this._customBody}
              @input=${(e: Event) => this._handleInput(e, 'body')}
            >
            <button @click=${this._sendTest}>
              Send Notification
            </button>
          </div>
        ` : ''}

        ${this._permission === 'denied' ? html`
          <div class="error-msg">
            Notifications are blocked. Please enable them in your browser settings to verify.
          </div>
        ` : ''}

        ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}
      </div>
    `;
  }
}
