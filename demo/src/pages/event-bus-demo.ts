
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/event-bus';
import { EventBusService } from '@deepverse/zero-ui';

@customElement('event-bus-demo')
export class EventBusDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }

    .demo-section {
      margin-bottom: 40px;
      padding: 32px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      height: 600px;
      display: flex;
      flex-direction: column;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      color: var(--text-main);
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    button {
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      color: white;
      transition: opacity 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    .btn-user { background: #3b82f6; }
    .btn-system { background: #f59e0b; }
    .btn-notif { background: #10b981; }
    .btn-error { background: #ef4444; }

    .preview {
      flex: 1;
      min-height: 0;
      background: #0f172a;
      border-radius: 12px;
      border: 1px solid var(--card-border);
      overflow: hidden;
    }

    zui-event-bus {
      width: 100%;
      height: 100%;
    }
  `;

  private _emitUserEvent() {
    EventBusService.emit('user:action', { action: 'click', target: 'button#123' }, 'UserModule');
  }

  private _emitSystemEvent() {
    EventBusService.emit('system:status', { cpu: 45, memory: '1.2GB', online: true }, 'SystemMonitor');
  }

  private _emitNotification() {
    EventBusService.emit('notification:new', { 
        title: 'New Message', 
        body: 'You have a new message from Alice',
        read: false
    }, 'NotificationService');
  }
  
  private _emitError() {
      EventBusService.emit('app:error', { code: 500, message: 'Internal Server Error' }, 'ApiGateway');
  }

  render() {
    return html`
      <h1>Event Bus Utility</h1>
      <p>Global messaging bus for decoupled communication. Includes a visual inspector.</p>

      <div class="demo-section">
        <h2>Interactive Inspector</h2>
        
        <div class="controls">
          <button class="btn-user" @click=${this._emitUserEvent}>Emit User Event</button>
          <button class="btn-system" @click=${this._emitSystemEvent}>Emit System Event</button>
          <button class="btn-notif" @click=${this._emitNotification}>Emit Notification</button>
          <button class="btn-error" @click=${this._emitError}>Emit Error</button>
        </div>

        <div class="preview">
          <zui-event-bus></zui-event-bus>
        </div>
      </div>
    `;
  }
}
