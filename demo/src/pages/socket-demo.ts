
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ZuiSocketService } from '@deepverse/zero-ui';
import '../components/event-bus/zui-event-bus.js';
// Note: We assume zero-ui exposes these. If not, we might need relative imports if running from mono-repo source.
// Checking demo-app.ts will confirm import style.

@customElement('socket-demo')
export class SocketDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      font-family: sans-serif;
      color: #e2e8f0;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      height: 80vh;
    }

    .panel {
      background: #1e293b;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #334155;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    h2 { margin: 0; font-size: 1.25rem; color: #93c5fd; }
    h3 { margin: 0; font-size: 1rem; color: #cbd5e1; }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: #0f172a;
      padding: 12px;
      border-radius: 8px;
    }

    label { font-size: 0.85rem; color: #94a3b8; }

    input[type="text"] {
      background: #334155;
      border: 1px solid #475569;
      color: white;
      padding: 8px;
      border-radius: 4px;
    }

    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    button.secondary { background: #475569; }
    button.danger { background: #ef4444; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-connected { background: #22c55e; color: #000; }
    .status-disconnected { background: #ef4444; color: #fff; }
    .status-connecting { background: #eab308; color: #000; }

    .log-container {
      flex: 1;
      overflow: hidden;
      border: 1px solid #334155;
      border-radius: 8px;
    }
  `;

  @state() private _connectionState = ZuiSocketService.getState();
  @state() private _url = 'wss://echo.websocket.org'; 
  @state() private _mockMode = true;
  @state() private _encryption = true;
  @state() private _channelInput = 'general';
  @state() private _messageInput = '';
  @state() private _messageType = 'chat';

  connectedCallback() {
    super.connectedCallback();
    // Listen for state changes globally via EventBus is one way, 
    // or we can implement a listener if we exposed it. 
    // The service emits 'socket:state_change'.
    // We'll rely on the event bus component to show logs, but for local UI state we need to key off events.
    // For now, I'll just poll or listen to event bus.
    // Ideally ZuiSocketService would emit standard events or have a subscribe method.
    // It uses EventBusService.
    
    // We can't easily import EventBusService here if it's not exported from 'zero-ui' main entry.
    // We'll assume for this demo we can control the UI via the user actions and some optimistic updates,
    // or better, standard window events if EventBus emits them? 
    // The EventBusService emits to internal listeners. 
    
    // Let's rely on manual refresh or just simple state tracking.
    // Actually, let's try to hook into the window event if specific event bus bridges to it.
    // Or just import EventBusService if available.
  }

  private _handleConnect() {
    ZuiSocketService.connect(this._url, {
      mock: this._mockMode,
      secure: true,
      encryption: { enabled: this._encryption }
    });
    this._updateState();
  }

  private _handleDisconnect() {
    ZuiSocketService.disconnect();
    this._updateState();
  }

  private _updateState() {
     // A bit hacky, normally we'd subscribe
     setTimeout(() => {
         this._connectionState = ZuiSocketService.getState();
         this.requestUpdate();
     }, 100);
     setTimeout(() => {
         this._connectionState = ZuiSocketService.getState();
         this.requestUpdate();
     }, 1000);
  }

  private _handleJoin() {
    if (this._channelInput) {
      ZuiSocketService.join(this._channelInput);
    }
  }

  private _handleLeave() {
    if (this._channelInput) {
      ZuiSocketService.leave(this._channelInput);
    }
  }

  private _handleSend() {
    if (this._messageInput) {
      ZuiSocketService.send(this._messageType, { text: this._messageInput });
      this._messageInput = '';
    }
  }

  render() {
    return html`
      <div class="grid">
        <div class="panel">
          <h2>Socket Controls</h2>
          
          <div class="control-group">
            <h3>Connection</h3>
            <div>
              Status: 
              <span class="status-badge status-${this._connectionState}">
                ${this._connectionState}
              </span>
            </div>
            
            <label>
              <input type="checkbox" ?checked=${this._mockMode} @change=${(e: any) => this._mockMode = e.target.checked}>
              Mock Mode
            </label>
            
            <label>
              <input type="checkbox" ?checked=${this._encryption} @change=${(e: any) => this._encryption = e.target.checked}>
              Encryption (AES-GCM)
            </label>

            <input type="text" .value=${this._url} @input=${(e: any) => this._url = e.target.value} placeholder="Server URL">
            
            <div style="display: flex; gap: 8px;">
              <button @click=${this._handleConnect} ?disabled=${this._connectionState === 'connected'}>Connect</button>
              <button class="danger" @click=${this._handleDisconnect} ?disabled=${this._connectionState === 'disconnected'}>Disconnect</button>
            </div>
          </div>

          <div class="control-group">
            <h3>Channels</h3>
            <input type="text" .value=${this._channelInput} @input=${(e: any) => this._channelInput = e.target.value} placeholder="Channel Name">
            <div style="display: flex; gap: 8px;">
               <button class="secondary" @click=${this._handleJoin}>Join</button>
               <button class="secondary" @click=${this._handleLeave}>Leave</button>
            </div>
          </div>

          <div class="control-group">
            <h3>Messaging</h3>
            <div style="display: flex; gap: 8px;">
                <input type="text" .value=${this._messageType} @input=${(e: any) => this._messageType = e.target.value} placeholder="Type" style="width: 80px;">
                <input type="text" .value=${this._messageInput} @input=${(e: any) => this._messageInput = e.target.value} placeholder="Payload (JSON/Text)" style="flex:1;">
            </div>
            <button @click=${this._handleSend}>Send Message</button>
          </div>
        </div>

        <div class="panel">
          <h2>Event Bus Log</h2>
          <div class="log-container">
            <zui-event-bus></zui-event-bus>
          </div>
        </div>
      </div>
    `;
  }
}
