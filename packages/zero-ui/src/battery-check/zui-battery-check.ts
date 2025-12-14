import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BatteryCheckService, type BatteryInfo } from '../services/battery.service.js';

@customElement('zui-battery-check')
export class ZuiBatteryCheck extends LitElement {
  @state() private _batteryInfo: BatteryInfo | null = null;

  private _handleUpdate = (info: BatteryInfo) => {
    this._batteryInfo = info;
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
      margin-bottom: 20px;
    }

    .battery-visual {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    /* Battery Icon Container */
    .battery-icon-container {
      width: 60px;
      height: 30px;
      border: 3px solid var(--text-muted, rgba(255, 255, 255, 0.3));
      border-radius: 6px;
      padding: 3px;
      position: relative;
    }
    
    .battery-icon-container::after {
      content: '';
      position: absolute;
      right: -7px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 12px;
      background: var(--text-muted, rgba(255, 255, 255, 0.3));
      border-radius: 0 2px 2px 0;
    }

    .battery-fill {
      height: 100%;
      background: #34d399;
      border-radius: 2px;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .battery-fill.low { background: #f87171; }
    .battery-fill.medium { background: #fbbf24; }
    .battery-fill.charging { 
      background: #34d399; 
      box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
    }

    .battery-text {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-main, #fff);
    }

    .status-text {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .charging-icon {
      color: #fbbf24;
      font-weight: bold;
    }
    
    .error-msg {
      color: var(--text-muted, #9ca3af);
      font-style: italic;
      text-align: center;
      padding: 20px 0;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    BatteryCheckService.subscribe(this._handleUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    BatteryCheckService.unsubscribe(this._handleUpdate);
  }

  private _getLevelColor(level: number): string {
    if (level <= 0.2) return 'low';
    if (level <= 0.5) return 'medium';
    return 'high';
  }

  private _formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds === 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }

  render() {
    if (!this._batteryInfo) return html`<div class="card">Loading...</div>`;

    if (!this._batteryInfo.supported) {
      return html`
        <div class="card">
          <div class="card-header">Battery Status</div>
          <div class="error-msg">Battery API not supported in this browser.</div>
        </div>
      `;
    }

    const { level, charging, chargingTime, dischargingTime } = this._batteryInfo;
    const percentage = Math.round(level * 100);
    const fillClass = charging ? 'charging' : this._getLevelColor(level);
    
    let timeText = '';
    if (charging && isFinite(chargingTime) && chargingTime > 0) {
      timeText = `• ${this._formatTime(chargingTime)} until full`;
    } else if (!charging && isFinite(dischargingTime) && dischargingTime > 0) {
      timeText = `• ${this._formatTime(dischargingTime)} remaining`;
    }

    return html`
      <div class="card">
        <div class="card-header">Battery Status</div>
        
        <div class="battery-visual">
          <div class="battery-icon-container">
            <div class="battery-fill ${fillClass}" style="width: ${percentage}%"></div>
          </div>
          <div class="battery-text">${percentage}%</div>
        </div>

        <div class="status-text">
          ${charging ? html`<span class="charging-icon">⚡ Using Power</span>` : 'Using Battery'}
          ${timeText}
        </div>
      </div>
    `;
  }
}
