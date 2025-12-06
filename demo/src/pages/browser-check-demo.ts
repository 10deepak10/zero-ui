import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/browser-check';

@customElement('browser-check-demo')
export class BrowserCheckDemo extends LitElement {
  @state() private _detectedBrowser: any = null;

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

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
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

  private _handleBrowserDetected(e: CustomEvent) {
    this._detectedBrowser = e.detail;
    console.log('Browser Detected:', e.detail);
  }

  render() {
    return html`
      <h1>Browser Check</h1>

      <div class="section">
        <h2>Basic Detection</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-browser-check 
              @browser-detected=${this._handleBrowserDetected}
            ></zui-browser-check>
            ${this._detectedBrowser ? html`
              <div class="code-block">Detected Browser:
${JSON.stringify(this._detectedBrowser, null, 2)}</div>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="section">
        <h2>With Version</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-browser-check showVersion></zui-browser-check>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Without Icon</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-browser-check ?showIcon=${false}></zui-browser-check>
          </div>
        </div>
      </div>
    `;
  }
}
