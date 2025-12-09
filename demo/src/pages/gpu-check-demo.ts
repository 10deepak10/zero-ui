import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/gpu-check';
import { GpuCheckService, type GpuInfo } from '@deepverse/zero-ui';

@customElement('gpu-check-demo')
export class GpuCheckDemo extends LitElement {
  @state() private _serviceInfo: GpuInfo | null = null;

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
  `;

  connectedCallback() {
    super.connectedCallback();
    this._serviceInfo = GpuCheckService.getGpuInfo();
  }

  render() {
    return html`
      <h1>GPU Check</h1>

      <div class="section">
        <h2>Component Usage</h2>
        <div class="demo-item">
          <zui-gpu-check></zui-gpu-check>
        </div>
      </div>

      <div class="section">
        <h2>Service Usage (Headless)</h2>
        <div class="code-block">
import { GpuCheckService } from '@deepverse/zero-ui';

const info = GpuCheckService.getGpuInfo();
        </div>
        
        <div class="code-block" style="margin-top: 10px; border-left: 4px solid #3b82f6;">
// Result:
${JSON.stringify(this._serviceInfo, null, 2)}
        </div>
      </div>
    `;
  }
}
