import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/otp-input';

@customElement('otp-input-demo')
export class OtpInputDemo extends LitElement {
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
