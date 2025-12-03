import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/button';

@customElement('button-demo')
export class ButtonDemo extends LitElement {
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
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      margin-bottom: 24px;
    }
    pre {
      background: rgba(0,0,0,0.3);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,0.1);
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
