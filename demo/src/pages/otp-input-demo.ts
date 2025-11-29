import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/otp-input';

@customElement('otp-input-demo')
export class OtpInputDemo extends LitElement {
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
  private _otpValue = '';

  @state()
  private _otpComplete = '';

  render() {
    return html`
      <h1>OTP Input</h1>
      <p>A secure and user-friendly one-time password input field.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
          <zui-otp-input
            @zui-otp-change=${(e: CustomEvent) => this._otpValue = e.detail.value}
            @zui-otp-complete=${(e: CustomEvent) => this._otpComplete = e.detail.value}
          ></zui-otp-input>
          
          <div class="output">
            Current Value: ${this._otpValue}<br>
            Completed: ${this._otpComplete || '...'}
          </div>
        </div>
        <pre><code>&lt;zui-otp-input length="6"&gt;&lt;/zui-otp-input&gt;</code></pre>
      </div>

      <div class="demo-section">
        <h2>4-Digit OTP</h2>
        <div class="preview">
          <zui-otp-input length="4"></zui-otp-input>
        </div>
        <pre><code>&lt;zui-otp-input length="4"&gt;&lt;/zui-otp-input&gt;</code></pre>
      </div>
    `;
  }
}
