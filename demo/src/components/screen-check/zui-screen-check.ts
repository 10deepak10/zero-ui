import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ScreenCheckService, type ScreenInfo } from '@deepverse/zero-ui/screen-check';

@customElement('zui-screen-check')
export class ZuiScreenCheck extends LitElement {
  @property({ type: Boolean }) live = false;

  @state() private _screenInfo: ScreenInfo | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .screen-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-card {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .label {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-main, #fff);
      font-family: monospace;
    }

    .unit {
      font-size: 0.85rem;
      color: var(--text-muted, #9ca3af);
      font-weight: normal;
      margin-left: 4px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._updateScreenInfo();
    
    if (this.live) {
      window.addEventListener('resize', this._handleResize);
      screen.orientation?.addEventListener('change', this._handleResize);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._handleResize);
    screen.orientation?.removeEventListener('change', this._handleResize);
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('live')) {
      if (this.live) {
        window.addEventListener('resize', this._handleResize);
        screen.orientation?.addEventListener('change', this._handleResize);
      } else {
        window.removeEventListener('resize', this._handleResize);
        screen.orientation?.removeEventListener('change', this._handleResize);
      }
    }
  }

  private _handleResize = () => {
    this._updateScreenInfo();
  };

  private _updateScreenInfo() {
    const info = ScreenCheckService.getScreenInfo();

    // Only update if changed
    if (JSON.stringify(info) !== JSON.stringify(this._screenInfo)) {
      this._screenInfo = info;
      this.dispatchEvent(new CustomEvent('screen-change', {
        bubbles: true,
        composed: true,
        detail: info
      }));
    }
  }

  render() {
    if (!this._screenInfo) return html`<div>Loading...</div>`;

    return html`
      <div class="screen-grid">
        <div class="info-card">
          <div class="label">Resolution</div>
          <div class="value">
            ${this._screenInfo.width} <span class="unit">x</span> ${this._screenInfo.height}
          </div>
        </div>

        <div class="info-card">
          <div class="label">Available Space</div>
          <div class="value">
            ${this._screenInfo.availWidth} <span class="unit">x</span> ${this._screenInfo.availHeight}
          </div>
        </div>

        <div class="info-card">
          <div class="label">Viewport Size</div>
          <div class="value">
            ${this._screenInfo.viewportWidth} <span class="unit">x</span> ${this._screenInfo.viewportHeight}
          </div>
        </div>

        <div class="info-card">
          <div class="label">Pixel Ratio</div>
          <div class="value">${this._screenInfo.pixelRatio}<span class="unit">x</span></div>
        </div>

        <div class="info-card">
          <div class="label">Color Depth</div>
          <div class="value">${this._screenInfo.colorDepth}<span class="unit">bit</span></div>
        </div>

        <div class="info-card">
          <div class="label">Orientation</div>
          <div class="value" style="font-size: 1rem; text-transform: capitalize;">
            ${this._screenInfo.orientation.replace(/-/g, ' ')}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-screen-check': ZuiScreenCheck;
  }
}
