import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('intro-page')
export class IntroPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      background: linear-gradient(120deg, #4a90e2, #9013fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-top: 40px;
    }
    .feature {
      padding: 24px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }
    .feature h3 {
      margin-top: 0;
      color: #4a90e2;
    }
  `;

  render() {
    return html`
      <h1>Welcome to Zero UI</h1>
      <p>
        Zero UI is a collection of high-performance Web Components built with Lit. 
        Designed to be lightweight, tree-shakeable, and universally compatible.
      </p>

      <div class="features">
        <div class="feature">
          <h3>🚀 Blazing Fast</h3>
          <p>Built on native web standards for zero overhead and maximum performance.</p>
        </div>
        <div class="feature">
          <h3>🌲 Tree-Shakeable</h3>
          <p>Modular architecture means you only bundle what you use.</p>
        </div>
        <div class="feature">
          <h3>🔌 Universal</h3>
          <p>Works seamlessly with React, Angular, Vue, and vanilla HTML.</p>
        </div>
      </div>
    `;
  }
}
