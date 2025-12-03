import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/toggle';

@customElement('toggle-demo')
export class ToggleDemo extends LitElement {
  @state() private _checked1 = false;

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
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
    }

    .custom-theme {
      --zui-toggle-bg-on: #10b981;
      --zui-toggle-width: 60px;
      --zui-toggle-height: 30px;
      --zui-toggle-thumb-size: 26px;
    }
  `;

  render() {
    return html`
      <h1>Toggle Switch</h1>

      <div class="section">
        <h2>Basic Usage</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-toggle 
              label="Notifications" 
              .checked=${this._checked1}
              @change=${(e: any) => this._checked1 = e.detail.checked}
            ></zui-toggle>
            <div class="code-block">Checked: ${this._checked1}</div>
          </div>

          <div class="demo-item">
            <zui-toggle 
              label="Auto-save" 
              checked
            ></zui-toggle>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>States</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-toggle label="Disabled Off" disabled></zui-toggle>
          </div>
          <div class="demo-item">
            <zui-toggle label="Disabled On" disabled checked></zui-toggle>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Custom Styling</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-toggle 
              class="custom-theme" 
              label="Custom Size & Color" 
              checked
            ></zui-toggle>
          </div>
        </div>
      </div>
    `;
  }
}
