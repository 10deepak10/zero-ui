import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/star-rating';

@customElement('star-rating-demo')
export class StarRatingDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }

    .demo-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .output {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
  `;

  @state()
  private _rating1 = 0;

  @state()
  private _rating2 = 3;

  @state()
  private _rating3 = 4;

  render() {
    return html`
      <h1>Star Rating</h1>
      <p>A customizable star rating component.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
          <zui-star-rating
            .value=${this._rating1}
            @zui-rating-change=${(e: CustomEvent) => this._rating1 = e.detail.value}
          ></zui-star-rating>
          <div class="output">Current Rating: ${this._rating1} / 5</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Custom Max Stars (10)</h2>
        <div class="preview">
          <zui-star-rating
            max="10"
            .value=${this._rating2}
            @zui-rating-change=${(e: CustomEvent) => this._rating2 = e.detail.value}
          ></zui-star-rating>
          <div class="output">Current Rating: ${this._rating2} / 10</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Read Only</h2>
        <div class="preview">
          <zui-star-rating
            readonly
            .value=${this._rating3}
          ></zui-star-rating>
          <div class="output">Rating: ${this._rating3} / 5 (Cannot be changed)</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Fractional / Average Values</h2>
        <div class="preview">
          <div style="display: flex; gap: 2rem; align-items: center;">
            <div>
              <zui-star-rating readonly value="4.2"></zui-star-rating>
              <div class="output">4.2 / 5</div>
            </div>
            <div>
              <zui-star-rating readonly value="3.5"></zui-star-rating>
              <div class="output">3.5 / 5</div>
            </div>
            <div>
              <zui-star-rating readonly value="1.8"></zui-star-rating>
              <div class="output">1.8 / 5</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
