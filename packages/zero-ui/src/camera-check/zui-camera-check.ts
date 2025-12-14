import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { CameraCheckService, type CameraDevice, type PermissionStatus } from '../services/camera.service.js';

@customElement('zui-camera-check')
export class ZuiCameraCheck extends LitElement {
  @state() private _permission: PermissionStatus = 'unknown';
  @state() private _devices: CameraDevice[] = [];
  @state() private _isChecking = false;
  @state() private _stream: MediaStream | null = null;
  @state() private _error: string | null = null;

  @property({ type: Boolean }) showPreview = false;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 20px;
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
    .status-unknown { background: rgba(156, 163, 175, 0.2); color: #d1d5db; }

    .action-area {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      justify-content: center;
      min-height: 100px;
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
    }

    button:hover {
      background: #2563eb;
    }

    button:disabled {
      background: #1f2937;
      color: #6b7280;
      cursor: not-allowed;
    }

    .device-list {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .device-item {
      background: var(--bg-muted, rgba(255, 255, 255, 0.05));
      padding: 10px;
      border-radius: 6px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .video-preview {
      margin-top: 20px;
      width: 100%;
      max-width: 320px;
      border-radius: 8px;
      background: #000;
      aspect-ratio: 16/9;
      object-fit: cover;
    }

    .error-msg {
      color: #f87171;
      font-size: 0.9rem;
      margin-top: 10px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    this._permission = await CameraCheckService.checkPermission();
    if (this._permission === 'granted') {
      this._loadDevices();
      if (this.showPreview) {
        this._startPreview();
      }
    }
    // Subscribe to permission changes
    CameraCheckService.subscribe(this._handlePermissionChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopStream();
    CameraCheckService.unsubscribe(this._handlePermissionChange);
  }

  private _handlePermissionChange = async (status: PermissionStatus) => {
    this._permission = status;
    if (status === 'granted') {
      this._loadDevices();
      if (this.showPreview) {
        this._startPreview();
      }
    } else {
      // Permission revoked or reset
      this._devices = [];
      this._stopStream();
    }
  };

  private _stopStream() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
  }

  private async _requestAccess() {
    this._isChecking = true;
    this._error = null;
    try {
      const granted = await CameraCheckService.requestAccess();
      if (granted) {
        // Permission change listener will handle the rest
      } else {
        // Check manually in case listener didn't fire (e.g. denied)
        this._permission = await CameraCheckService.checkPermission();
      }
    } catch (e) {
      this._error = 'Failed to access camera';
      this._permission = 'denied';
    } finally {
      this._isChecking = false;
    }
  }

  private async _loadDevices() {
    this._devices = await CameraCheckService.getDevices();
  }

  private async _startPreview() {
    this._stopStream();
    this._stream = await CameraCheckService.getStream();
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <span class="title">Camera Access</span>
          <span class="status-badge status-${this._permission}">${this._permission}</span>
        </div>

        ${this._permission !== 'granted' ? html`
          <div class="action-area">
            <p style="color: var(--text-muted); text-align: center; font-size: 0.9rem;">
              Camera access is required to verify functionality.
            </p>
            <button @click=${this._requestAccess} ?disabled=${this._isChecking}>
              ${this._isChecking ? 'Checking...' : 'Check Camera'}
            </button>
            ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}
          </div>
        ` : this._renderContent()}
      </div>
    `;
  }

  private _renderContent() {
    return html`
      ${this._devices.length > 0 ? html`
        <div class="device-list">
          <div class="title" style="margin-bottom: 8px;">Detected Devices</div>
          ${this._devices.map(device => html`
            <div class="device-item">
              <span>📷</span>
              <span>${device.label}</span>
            </div>
          `)}
        </div>
      ` : html`
        <div style="text-align: center; padding: 20px; color: var(--text-muted);">
          No cameras detected (or labels hidden).
        </div>
      `}

      ${this.showPreview && this._stream ? html`
        <div style="margin-top: 20px;">
          <div class="title" style="margin-bottom: 8px;">Preview</div>
          <video class="video-preview" .srcObject=${this._stream} autoplay playsinline muted></video>
        </div>
      ` : ''}
    `;
  }
}
