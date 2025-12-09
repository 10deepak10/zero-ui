import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/clipboard-check';

@customElement('clipboard-check-demo')
export class ClipboardCheckDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      color: white;
    }

    h1 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .description {
      margin-bottom: 30px;
      color: #9ca3af;
      line-height: 1.6;
    }

    .demo-container {
      max-width: 600px;
    }

    code {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  `;

  render() {
    return html`
      <h1>Clipboard Check Component</h1>
      <p class="description">
        The <code>&lt;zui-clipboard-check&gt;</code> component manages clipboard permissions
        and provides functionality to read from and write to the system clipboard.
        It supports both modern Clipboard API and legacy fallback methods for broader browser compatibility.
      </p>

      <div class="demo-container">
        <zui-clipboard-check></zui-clipboard-check>
      </div>
    `;
  }
}
