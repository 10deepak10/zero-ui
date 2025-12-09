import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/theme-check';

@customElement('theme-check-demo')
export class ThemeCheckDemo extends LitElement {
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
      max-width: 400px;
    }
  `;

  render() {
    return html`
      <h1>Theme Check Component</h1>
      <p class="description">
        The <code>&lt;zui-theme-check&gt;</code> component automatically detects your system's color scheme preference (Dark vs Light).
        Try changing your browser or OS theme settings to see it update immediately.
      </p>

      <div class="demo-container">
        <zui-theme-check></zui-theme-check>
      </div>
    `;
  }
}
