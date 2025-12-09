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
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
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
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.05);
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

  render() {
    return html`
      <div class="card">
        <div class="card-header">Network Status</div>
        
        <div class="status-badge ${this._networkInfo.online ? 'online' : 'offline'}">
          <div class="status-dot"></div>
          ${this._networkInfo.online ? 'Online' : 'Offline'}
        </div>

        ${this._networkInfo.online ? html`
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Interface</div>
              <div class="value">${this._networkInfo.type}</div>
            </div>
            <div class="info-item">
              <div class="label">Effective Speed</div>
              <div class="value">${this._networkInfo.effectiveType ? this._networkInfo.effectiveType.toUpperCase() : 'Unknown'}</div>
            </div>
            <div class="info-item">
              <div class="label">Downlink</div>
              <div class="value">${this._networkInfo.downlink ? `${this._networkInfo.downlink} Mb/s` : 'Unknown'}</div>
            </div>
            <div class="info-item">
              <div class="label">Latency (RTT)</div>
              <div class="value">${this._networkInfo.rtt ? `${this._networkInfo.rtt} ms` : 'Unknown'}</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}
