import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/button';

@customElement('card-demo')
export class CardDemo extends LitElement {
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
      justify-content: center;
    }
    pre {
      background: rgba(0,0,0,0.3);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    zui-card {
      max-width: 400px;
      width: 100%;
    }
  `;

  render() {
    return html`
      <h1>Card</h1>
      <p>Cards contain content and actions about a single subject.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
          <zui-card>
            <h3>Card Title</h3>
            <p>This is a simple card component. It can hold any content you want.</p>
            <div style="margin-top: 16px;">
              <zui-button>Action</zui-button>
            </div>
          </zui-card>
        </div>
        <pre><code>&lt;zui-card&gt;
  &lt;h3&gt;Card Title&lt;/h3&gt;
  &lt;p&gt;Content...&lt;/p&gt;
&lt;/zui-card&gt;</code></pre>
      </div>
    `;
  }
}
