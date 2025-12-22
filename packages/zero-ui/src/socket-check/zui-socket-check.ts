import { LitElement, html, css, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ZuiSocketService, type ConnectionState, type ZuiSocketMessage } from '../services/socket.service.js';
import { EventBusService, type EventBusEvent } from '../services/event-bus.service.js';

@customElement('zui-socket-check')
export class ZuiSocketCheck extends LitElement {
  @state() private _state: ConnectionState = 'idle';
  @state() private _url: string = 'wss://echo.websocket.org';
  @state() private _logs: TemplateResult[] = [];
  @state() private _mockMode: boolean = true;
  @state() private _channelInput: string = 'general';
  @state() private _messageType: string = 'ping';
  @state() private _messagePayload: string = '{"hello": "world"}';

  private _maxLogs = 50;

  static styles = css`
    :host {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .card {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 16px;
      color: #e2e8f0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .title {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-idle { background: #475569; color: #cbd5e1; }
    .status-connecting { background: #d97706; color: #fffbeb; }
    .status-connected { background: #059669; color: #d1fae5; }
    .status-disconnected { background: #dc2626; color: #fee2e2; }
    .status-reconnecting { background: #ca8a04; color: #fef3c7; }
    .status-error { background: #ef4444; color: #fee2e2; }

    .control-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    input[type="text"] {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      flex: 1;
      font-family: monospace;
      min-width: 150px;
    }

    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    button:hover { opacity: 0.9; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-primary { background: #3b82f6; color: white; }
    .btn-danger { background: #ef4444; color: white; }
    .btn-secondary { background: #4b5563; color: white; }

    .console {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      height: 200px;
      overflow-y: auto;
      padding: 12px;
      font-family: 'Consolas', monospace;
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .log-entry {
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 4px;
      word-break: break-all;
    }

    .log-ts { color: #64748b; margin-right: 8px; }
    .log-socket { color: #d8b4fe; }
    .log-in { color: #4ade80; }
    .log-out { color: #60a5fa; }
    .log-err { color: #f87171; }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      cursor: pointer;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._state = ZuiSocketService.getState();
    EventBusService.subscribeAll(this._handleEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    EventBusService.unsubscribeAll(this._handleEvent);
  }

  private _handleEvent = (event: EventBusEvent) => {
    // Listen for socket events
    if (event.name.startsWith('socket:')) {
      if (event.name === 'socket:state_change') {
        this._state = event.data.state;
      }
      this._addLog(event);
    }
  };

  private _addLog(event: EventBusEvent) {
    const ts = new Date(event.timestamp).toLocaleTimeString();
    let msg = '';
    let typeClass = 'log-socket';

    if (event.name === 'socket:message') {
        const payload = event.data as ZuiSocketMessage;
        typeClass = payload.source === 'client' ? 'log-out' : 'log-in';
        msg = `[${payload.type}] ${JSON.stringify(payload.payload)}`;
    } else {
        msg = `${event.name} ${JSON.stringify(event.data || '')}`;
    }

    const logEntry = html`
      <span class="log-ts">${ts}</span>
      <span class="${typeClass}">${msg}</span>
    `;
    
    this._logs = [logEntry, ...this._logs].slice(0, this._maxLogs);
  }

  private _toggleConnect() {
    if (this._state === 'connected' || this._state === 'connecting') {
      ZuiSocketService.disconnect();
    } else {
      ZuiSocketService.connect(this._url, { 
        mock: this._mockMode,
        autoReconnect: true 
      });
    }
  }

  private _joinChannel() {
    if (this._channelInput) {
      ZuiSocketService.join(this._channelInput);
    }
  }

  private _leaveChannel() {
     if (this._channelInput) {
      ZuiSocketService.leave(this._channelInput);
    }
  }

  private _send() {
    try {
      const payload = JSON.parse(this._messagePayload);
      if (this._channelInput) {
          ZuiSocketService.sendTo(this._channelInput, this._messageType, payload);
      } else {
          ZuiSocketService.send(this._messageType, payload);
      }
    } catch (e) {
      alert('Invalid JSON payload');
    }
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <span class="title">Socket Service</span>
          <span class="status-badge status-${this._state}">${this._state}</span>
        </div>

        <div class="control-row">
          <input type="text" .value=${this._url} @input=${(e: any) => this._url = e.target.value} placeholder="wss://..." ?disabled=${this._state !== 'idle' && this._state !== 'disconnected'}>
          <label>
            <input type="checkbox" ?checked=${this._mockMode} @change=${(e: any) => this._mockMode = e.target.checked}> Mock
          </label>
          <button 
            class="${this._state === 'connected' ? 'btn-danger' : 'btn-primary'}"
            @click=${this._toggleConnect}
          >
            ${this._state === 'connected' ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        <div class="control-row">
           <input type="text" .value=${this._channelInput} @input=${(e: any) => this._channelInput = e.target.value} placeholder="Channel Name">
           <button class="btn-secondary" @click=${this._joinChannel} ?disabled=${this._state !== 'connected'}>Join</button>
           <button class="btn-secondary" @click=${this._leaveChannel} ?disabled=${this._state !== 'connected'}>Leave</button>
        </div>

        <div class="control-row">
           <input type="text" .value=${this._messageType} @input=${(e: any) => this._messageType = e.target.value} placeholder="Type" style="flex: 0 0 100px;">
           <input type="text" .value=${this._messagePayload} @change=${(e: any) => this._messagePayload = e.target.value} placeholder="Payload (JSON)">
           <button class="btn-primary" @click=${this._send} ?disabled=${this._state !== 'connected'}>Send</button>
        </div>

        <div class="console">
          ${this._logs.map(log => html`<div class="log-entry">${log}</div>`)}
          ${this._logs.length === 0 ? html`<div style="color: #64748b; font-style: italic;">No logs yet...</div>` : ''}
        </div>
      </div>
    `;
  }
}
