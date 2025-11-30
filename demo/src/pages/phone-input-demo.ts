import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/phone-input';

@customElement('phone-input-demo')
export class PhoneInputDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }
    .demo-section {
      margin-bottom: 40px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 24px;
    }
    .preview {
      padding: 24px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .output {
      margin-top: 16px;
      padding: 12px;
      background: #eef2ff;
      border-radius: 6px;
      font-family: monospace;
      color: #3730a3;
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
