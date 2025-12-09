import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { GpuCheckService, type GpuInfo } from '../services/gpu.service.js';

@customElement('zui-gpu-check')
export class ZuiGpuCheck extends LitElement {
  @state() private _gpuInfo: GpuInfo | null = null;

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

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .info-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .label {
      color: var(--text-muted, #9ca3af);
      font-size: 0.95rem;
    }

    .value {
      color: var(--text-main, #fff);
      font-weight: 500;
      text-align: right;
    }

    .badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge.high { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge.medium { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
    .badge.low { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .badge.unknown { background: rgba(156, 163, 175, 0.2); color: #d1d5db; }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._gpuInfo = GpuCheckService.getGpuInfo();
  }

  render() {
    if (!this._gpuInfo) return html`<div>Checking GPU...</div>`;

    const tierClass = this._gpuInfo.tier.toLowerCase();

    return html`
      <div class="card">
        <div class="card-header">GPU Information</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Vendor</span>
            <span class="value">${this._gpuInfo.vendor}</span>
          </div>
          <div class="info-item">
            <span class="label">Renderer</span>
            <span class="value">${this._gpuInfo.renderer}</span>
          </div>
          <div class="info-item">
            <span class="label">Hardware Acceleration</span>
            <span class="value" style="color: ${this._gpuInfo.isHardwareAccelerated ? '#34d399' : '#f87171'}">
              ${this._gpuInfo.isHardwareAccelerated ? 'Enabled' : 'Disabled/Unavailable'}
            </span>
          </div>
          <div class="info-item">
            <span class="label">Performance Tier</span>
            <span class="badge ${tierClass}">${this._gpuInfo.tier}</span>
          </div>
        </div>
      </div>
    `;
  }
}
