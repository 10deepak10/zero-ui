import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/button';

@customElement('button-demo')
export class ButtonDemo extends LitElement {
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
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 24px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 16px;
    }
  `;

  render() {
    return html`
      <h1>Button</h1>
      <p>Buttons allow users to take actions, and make choices, with a single tap.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
          <zui-button>Default Button</zui-button>
          <zui-button>Click Me</zui-button>
        </div>
        <pre><code>&lt;zui-button&gt;Default Button&lt;/zui-button&gt;</code></pre>
      </div>
    `;
  }
}
