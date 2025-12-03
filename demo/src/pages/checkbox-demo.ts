import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/checkbox';

@customElement('checkbox-demo')
export class CheckboxDemo extends LitElement {
  @state() private _checked1 = false;
  @state() private _indeterminate = true;

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
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
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
      --zui-checkbox-color: #10b981;
      --zui-checkbox-border-radius: 50%;
    }
  `;

  render() {
    return html`
      <h1>Checkbox</h1>

      <div class="section">
        <h2>Basic Usage</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-checkbox 
              label="Accept Terms" 
              .checked=${this._checked1}
              @change=${(e: any) => this._checked1 = e.detail.checked}
            ></zui-checkbox>
            <div class="code-block">Checked: ${this._checked1}</div>
          </div>

          <div class="demo-item">
            <zui-checkbox 
              label="Subscribe to newsletter" 
              checked
            ></zui-checkbox>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>States</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-checkbox label="Disabled Unchecked" disabled></zui-checkbox>
          </div>
          <div class="demo-item">
            <zui-checkbox label="Disabled Checked" disabled checked></zui-checkbox>
          </div>
          <div class="demo-item">
            <zui-checkbox 
              label="Indeterminate" 
              .indeterminate=${this._indeterminate}
              @change=${() => this._indeterminate = false}
            ></zui-checkbox>
            <button 
              @click=${() => this._indeterminate = true}
              style="margin-top: 10px; padding: 5px 10px; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 4px; cursor: pointer;"
            >
              Reset Indeterminate
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Custom Styling</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-checkbox 
              class="custom-theme" 
              label="Custom Colors & Shape" 
              checked
            ></zui-checkbox>
          </div>
        </div>
      </div>
    `;
  }
}
