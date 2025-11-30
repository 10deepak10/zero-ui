import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/phone-input';

@customElement('phone-input-demo')
export class PhoneInputDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }
    .demo-section {
      margin-bottom: 40px;
      padding: 32px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }
    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      color: var(--text-main);
    }
    .preview {
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
    }
    .output {
      margin-top: 16px;
      padding: 12px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 6px;
      font-family: monospace;
      color: var(--text-main);
      width: 100%;
      max-width: 400px;
    }
    pre {
      background: rgba(0,0,0,0.3);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,0.1);
    }
  `;

  @state()
  private _phoneValue = '';

  @state()
  private _isValid = false;

  render() {
    return html`
      <h1>Phone Input</h1>
      <p>A phone number input with country code selector.</p>

      <div class="demo-section">
        <h2>Basic Usage (All Countries)</h2>
        <div class="preview">
          <zui-phone-input
            @zui-phone-change=${(e: CustomEvent) => {
              this._phoneValue = e.detail.value;
              this._isValid = e.detail.isValid;
            }}
          ></zui-phone-input>
          
          <div class="output">
            Current Value: ${this._phoneValue || '...'}<br>
            Status: <span style="color: ${this._isValid ? '#16a34a' : '#dc2626'}">
              ${this._isValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
        </div>
        <pre><code>&lt;zui-phone-input&gt;&lt;/zui-phone-input&gt;</code></pre>
      </div>

      <div class="demo-section">
        <h2>Filtered Countries (US, CA, GB)</h2>
        <div class="preview">
          <zui-phone-input
            .allowedCountries=${['US', 'CA', 'GB']}
          ></zui-phone-input>
        </div>
        <pre><code>&lt;zui-phone-input .allowedCountries="['US', 'CA', 'GB']"&gt;&lt;/zui-phone-input&gt;</code></pre>
      </div>
    `;
  }
}
