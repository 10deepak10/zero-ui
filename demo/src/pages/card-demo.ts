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
    }
    .demo-section {
      margin-bottom: 40px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 24px;
    }
    .preview {
      padding: 24px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    zui-card {
      max-width: 400px;
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
