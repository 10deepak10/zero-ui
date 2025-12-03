import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/radio-group';

@customElement('radio-group-demo')
export class RadioGroupDemo extends LitElement {
  @state() private _value1 = 'option1';
  @state() private _value2 = 'vertical1';

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
    }
  `;

  render() {
    return html`
      <h1>Radio Group</h1>

      <div class="section">
        <h2>Horizontal Layout</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-radio-group 
              label="Select Plan" 
              orientation="horizontal"
              .value=${this._value1}
              @change=${(e: any) => this._value1 = e.detail.value}
            >
              <zui-radio value="option1">Basic</zui-radio>
              <zui-radio value="option2">Pro</zui-radio>
              <zui-radio value="option3">Enterprise</zui-radio>
            </zui-radio-group>
            <div class="code-block">Selected: ${this._value1}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Vertical Layout</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-radio-group 
              label="Choose Preference" 
              orientation="vertical"
              .value=${this._value2}
              @change=${(e: any) => this._value2 = e.detail.value}
            >
              <zui-radio value="vertical1">Option A</zui-radio>
              <zui-radio value="vertical2">Option B</zui-radio>
              <zui-radio value="vertical3" disabled>Option C (Disabled)</zui-radio>
            </zui-radio-group>
            <div class="code-block">Selected: ${this._value2}</div>
          </div>
        </div>
      </div>
    `;
  }
}
