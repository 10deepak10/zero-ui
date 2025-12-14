import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { NetworkCheckService, type NetworkInfo } from '../services/network.service.js';

@customElement('zui-network-check')
export class ZuiNetworkCheck extends LitElement {
  @state() private _networkInfo: NetworkInfo = { online: true };

  private _handleNetworkChange = (info: NetworkInfo) => {
    this._networkInfo = info;
  };

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 16px;
    }

    .card-header {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .status-badge.online {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-badge.offline {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 8px currentColor;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .info-item {
      background: var(--bg-muted, rgba(255, 255, 255, 0.02));
      border-radius: 8px;
      padding: 10px;
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.05));
    }

    .label {
      font-size: 0.8rem;
      color: var(--text-muted, #9ca3af);
      margin-bottom: 4px;
    }

    .value {
      font-size: 1rem;
      color: var(--text-main, #fff);
      font-weight: 500;
      text-transform: capitalize;
    }

    .speed-display {
      text-align: center;
      margin-bottom: 24px;
      padding: 20px 0;
      background: var(--bg-muted, rgba(255, 255, 255, 0.02));
      border-radius: 12px;
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.05));
    }

    .speed-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 2px;
    }

    .meter-container {
      position: relative;
      width: 200px;
      height: 100px;
      margin: 0 auto 10px auto;
    }

    .meter {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .meter-fill {
      transition: stroke-dashoffset 1s ease-out;
      transform-origin: center;
    }

    .meter-content {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      line-height: 1;
    }

    .speed-unit {
      font-size: 1.1rem;
      color: var(--text-muted, #9ca3af);
      font-weight: 500;
      margin-bottom: 8px;
    }

    .speed-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted, #9ca3af);
    }

    .test-btn {
      background: var(--bg-hover, rgba(255, 255, 255, 0.1));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.2));
      color: var(--text-main, #fff);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .test-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }

    .test-btn:disabled {
      opacity: 0.5;
      cursor: wait;
    }

    .error-msg {
      color: #f87171;
      font-size: 0.8rem;
      margin-top: 8px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    NetworkCheckService.subscribe(this._handleNetworkChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    NetworkCheckService.unsubscribe(this._handleNetworkChange);
  }

  private _getDisplaySpeed(): number {
    if (this._activeSpeed !== null) return this._activeSpeed;
    if (this._networkInfo.measuredSpeed) return this._networkInfo.measuredSpeed;
    if (this._networkInfo.downlink) return this._networkInfo.downlink;
    return 0;
  }

  private _calculateDashOffset(speed: number): number {
    // Max speed for gauge is 100 Mbps (can adjust)
    const maxSpeed = 100;
    const arcLength = 251; // PI * 80
    
    // speed / maxSpeed ratio
    let ratio = speed / maxSpeed;
    if (ratio > 1) ratio = 1;
    if (ratio < 0) ratio = 0;
    
    // Invert because stroke-dashoffset hides from the end
    // 251 offset = empty
    // 0 offset = full
    return arcLength * (1 - ratio);
  }

  @state() private _testStatus: 'idle' | 'running' | 'complete' | 'error' = 'idle';
  @state() private _activeSpeed: number | null = null;
  @state() private _error: string | null = null;

  private _runSpeedTest = async () => {
    this._testStatus = 'running';
    this._error = null;
    try {
      this._activeSpeed = await NetworkCheckService.measureConnectionSpeed();
      this._testStatus = 'complete';
    } catch (e) {
      this._testStatus = 'error';
      this._error = 'Test failed';
    }
  };

  render() {
    return html`
      <div class="card">
        <div class="card-header">Network Status</div>
        
        <div class="status-badge ${this._networkInfo.online ? 'online' : 'offline'}">
          <div class="status-dot"></div>
          ${this._networkInfo.online ? 'Online' : 'Offline'}
        </div>

        ${this._networkInfo.online ? html`
          <div class="speed-display">
            <!-- Meter / Gauge -->
            <div class="meter-container">
              <svg class="meter" viewBox="0 0 200 100">
                <!-- Background Arc -->
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--bg-muted, rgba(255,255,255,0.1))" stroke-width="20" />
                
                <!-- Foreground Arc (Active) -->
                <path 
                  class="meter-fill" 
                  d="M 20 100 A 80 80 0 0 1 180 100" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  stroke-width="20"
                  stroke-dasharray="251"
                  stroke-dashoffset="${this._calculateDashOffset(this._getDisplaySpeed())}"
                />
                
                <!-- Gradient Definition -->
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#34d399" />
                    <stop offset="100%" stop-color="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div class="meter-content">
                <div class="speed-value">
                  ${this._getDisplaySpeed()}
                </div>
                <div class="speed-unit">Mb/s</div>
              </div>
            </div>

            <div class="speed-label">
              ${this._testStatus === 'complete' || this._networkInfo.measuredSpeed 
                ? 'Measured Speed' 
                : 'Estimated Speed'}
            </div>
            
            <div style="margin-top: 20px;">
              <button 
                class="test-btn"
                @click=${this._runSpeedTest} 
                ?disabled=${this._testStatus === 'running'}
              >
                ${this._testStatus === 'running' ? 'Testing...' : 'Test Speed'}
              </button>
            </div>
            ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="label">Interface</div>
              <div class="value">${this._networkInfo.type}</div>
            </div>
            <div class="info-item">
              <div class="label">Effective Type</div>
              <div class="value">${this._networkInfo.effectiveType ? this._networkInfo.effectiveType.toUpperCase() : 'Unknown'}</div>
            </div>
            <div class="info-item">
              <div class="label">Latency</div>
              <div class="value">${this._networkInfo.rtt ? `${this._networkInfo.rtt} ms` : 'Unknown'}</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}
