import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/slider';

@customElement('slider-demo')
export class SliderDemo extends LitElement {
  @state() private _value1 = 50;
  @state() private _value2 = 20;
  @state() private _rangeValue: [number, number] = [25, 75];

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

    .custom-theme {
      --zui-slider-fill-color: #10b981;
      --zui-slider-thumb-border: 2px solid #10b981;
    }
  `;

  render() {
    return html`
      <h1>Slider</h1>

      <div class="section">
        <h2>Basic Usage</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-slider 
              label="Volume" 
              .value=${this._value1}
              @input=${(e: any) => this._value1 = e.detail.value}
            ></zui-slider>
            <div class="code-block">Value: ${this._value1}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Custom Range & Step</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-slider 
              label="Price Range ($0 - $1000)" 
              min="0"
              max="1000"
              step="10"
              .value=${this._value2}
              @input=${(e: any) => this._value2 = e.detail.value}
            ></zui-slider>
            <div class="code-block">Value: ${this._value2}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>States</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-slider label="Disabled" value="30" disabled></zui-slider>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Double Slider (Range)</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-slider 
              label="Price Range" 
              .value=${this._rangeValue}
              @input=${(e: any) => this._rangeValue = e.detail.value}
            ></zui-slider>
            <div class="code-block">Range: [${this._rangeValue[0]}, ${this._rangeValue[1]}]</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Custom Styling</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <zui-slider 
              class="custom-theme" 
              label="Custom Colors" 
              value="75"
            ></zui-slider>
          </div>
        </div>
      </div>
    `;
  }
}
