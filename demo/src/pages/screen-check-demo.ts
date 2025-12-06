import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/screen-check';

@customElement('screen-check-demo')
export class ScreenCheckDemo extends LitElement {
  @state() private _screenInfo: any = null;

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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .badge {
      font-size: 0.75rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
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
      margin-top: 20px;
      white-space: pre-wrap;
    }
  `;

  private _handleScreenChange(e: CustomEvent) {
    this._screenInfo = e.detail;
    console.log('Screen Info Changed:', e.detail);
  }

  render() {
    return html`
      <h1>Screen Check</h1>

      <div class="section">
        <h2>
          Live Monitor
          <span class="badge">Resize Window to Test</span>
        </h2>
        <div class="demo-item">
          <zui-screen-check 
            live 
            @screen-change=${this._handleScreenChange}
          ></zui-screen-check>
          
          ${this._screenInfo ? html`
            <div class="code-block">Event Data:
${JSON.stringify(this._screenInfo, null, 2)}</div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <h2>Static Snapshot</h2>
        <div class="demo-item">
          <zui-screen-check></zui-screen-check>
        </div>
      </div>
    `;
  }
}
