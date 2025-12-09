import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/camera-check';
import { CameraCheckService, type CameraDevice } from '@deepverse/zero-ui';

@customElement('camera-check-demo')
export class CameraCheckDemo extends LitElement {
  @state() private _permission: string = 'Unknown';
  @state() private _devices: CameraDevice[] = [];
  
  static styles = css`
    :host {
      display: block;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 30px;
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section {
      margin-bottom: 50px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 30px;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: var(--text-main);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 10px;
    }

    .demo-item {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .code-block {
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.9rem;
      color: #a5b4fc;
      margin-top: 10px;
      white-space: pre-wrap;
    }

    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 10px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    CameraCheckService.subscribe(this._handleUpdate);
    this._refreshInfo();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    CameraCheckService.unsubscribe(this._handleUpdate);
  }

  private _handleUpdate = () => {
    this._refreshInfo();
  };

  private async _refreshInfo() {
    this._permission = await CameraCheckService.checkPermission();
    this._devices = await CameraCheckService.getDevices();
  }

  render() {
    return html`
      <h1>Camera Check</h1>

      <div class="section">
        <h2>Component Usage</h2>
        <div class="demo-item">
          <zui-camera-check ?showPreview=${true}></zui-camera-check>
        </div>
      </div>

      <div class="section">
        <h2>Service Usage (Headless)</h2>
        <div class="code-block">
// Permission Status:
${this._permission}

// Detected Devices:
${JSON.stringify(this._devices, null, 2)}
        </div>
      </div>
    `;
  }
}
