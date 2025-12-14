import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { MicCheckService, type MicDevice, type PermissionStatus } from '../services/mic.service.js';

@customElement('zui-mic-check')
export class ZuiMicCheck extends LitElement {
  @state() private _permission: PermissionStatus = 'unknown';
  @state() private _devices: MicDevice[] = [];
  @state() private _isChecking = false;
  @state() private _stream: MediaStream | null = null;
  @state() private _error: string | null = null;
  @state() private _audioContext: AudioContext | null = null;
  @state() private _analyser: AnalyserNode | null = null;
  @state() private _dataArray: Uint8Array | null = null;
  @state() private _volume: number = 0; // 0 to 100
  
  private _animationId: number | null = null;

  @property({ type: Boolean }) showVisualizer = false;

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

    .error-msg {
      color: #f87171;
      font-size: 0.9rem;
      margin-top: 10px;
    }

    /* Visualizer Meter */
    .meter-container {
      margin-top: 20px;
      background: var(--bg-muted, rgba(0, 0, 0, 0.3));
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .visualizer-bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 60px;
      width: 100%;
      justify-content: center;
    }

    .bar {
      width: 6px;
      background: #3b82f6;
      border-radius: 2px;
      transition: height 0.05s ease;
      min-height: 2px;
    }

    .volume-label {
      margin-top: 8px;
      font-size: 0.8rem;
      color: var(--text-muted, #9ca3af);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    this._permission = await MicCheckService.checkPermission();
    if (this._permission === 'granted') {
      await this._loadDevices();
      if (this.showVisualizer) {
        this._startVisualizer();
      }
    }
    MicCheckService.subscribe(this._handlePermissionChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopStream();
    MicCheckService.unsubscribe(this._handlePermissionChange);
  }

  private _handlePermissionChange = async (status: PermissionStatus) => {
    this._permission = status;
    if (status === 'granted') {
      await this._loadDevices();
      if (this.showVisualizer) {
        this._startVisualizer();
      }
    } else {
      this._devices = [];
      this._stopStream();
    }
  };

  private _stopStream() {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
    if (this._audioContext) {
      this._audioContext.close();
      this._audioContext = null;
    }
  }

  private async _requestAccess() {
    this._isChecking = true;
    this._error = null;
    try {
      const granted = await MicCheckService.requestAccess();
      if (!granted) {
        // Double check permissions
        this._permission = await MicCheckService.checkPermission();
        if (this._permission !== 'granted') {
           this._error = 'Failed to access microphone';
           this._permission = 'denied';
        }
      }
    } catch (e) {
      this._error = 'Error requesting access';
    } finally {
      this._isChecking = false;
    }
  }

  private async _loadDevices() {
    this._devices = await MicCheckService.getDevices();
  }

  private async _startVisualizer() {
    this._stopStream(); // Clear old
    try {
      this._stream = await MicCheckService.getStream();
      
      this._audioContext = new AudioContext();
      const source = this._audioContext.createMediaStreamSource(this._stream);
      this._analyser = this._audioContext.createAnalyser();
      this._analyser.fftSize = 64; // Small size for simple bars
      source.connect(this._analyser);
      
      const bufferLength = this._analyser.frequencyBinCount;
      this._dataArray = new Uint8Array(bufferLength);
      
      this._animate();
    } catch (e) {
      this._error = 'Failed to start visualizer';
    }
  }

  private _animate = () => {
    if (!this._analyser || !this._dataArray) return;
    
    this._analyser.getByteFrequencyData(this._dataArray as any);
    
    // Trigger update
    this.requestUpdate();
    
    // Calculate volume avg for fun
    let sum = 0;
    for(let i = 0; i < this._dataArray.length; i++) {
        sum += this._dataArray[i];
    }
    this._volume = Math.round(sum / this._dataArray.length);

    this._animationId = requestAnimationFrame(this._animate);
  };

  render() {
    return html`
      <div class="card">
        <div class="header">
          <span class="title">Microphone Access</span>
          <span class="status-badge status-${this._permission}">${this._permission}</span>
        </div>

        ${this._permission !== 'granted' ? html`
          <div class="action-area">
             <p style="color: var(--text-muted); text-align: center; font-size: 0.9rem;">
              Microphone access is required to test input.
            </p>
            <button @click=${this._requestAccess} ?disabled=${this._isChecking}>
              ${this._isChecking ? 'Checking...' : 'Check Microphone'}
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
              <span>🎤</span>
              <span>${device.label}</span>
            </div>
          `)}
        </div>
      ` : html`
        <div style="text-align: center; padding: 20px; color: var(--text-muted);">
          No microphones detected.
        </div>
      `}

      ${this.showVisualizer && this._stream ? this._renderVisualizer() : ''}
    `;
  }

  private _renderVisualizer() {
    if (!this._dataArray) return html``;
    
    // Render a few bars based on freq data
    // We have 32 bins (fftSize 64 / 2). Let's pick 10 distributed ones
    const bars = [];
    const step = Math.floor(this._dataArray.length / 10);
    
    for (let i = 0; i < 10; i++) {
      const value = this._dataArray[i * step] || 0;
      // height percent
      const height = (value / 255) * 100;
      // dynamic color based on volume/intensity
      const color = value > 200 ? '#ef4444' : (value > 100 ? '#fbbf24' : '#3b82f6');
      
      bars.push(html`
        <div 
          class="bar" 
          style="height: ${Math.max(4, height)}%; background: ${color};"
        ></div>
      `);
    }

    return html`
      <div class="meter-container">
        <div class="title" style="margin-bottom: 12px; align-self: flex-start;">Audio Level</div>
        <div class="visualizer-bars">
          ${bars}
        </div>
        <div class="volume-label">Input Level: ${this._volume}%</div>
      </div>
    `;
  }
}
